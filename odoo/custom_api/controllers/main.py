import json
import hashlib
from odoo import http
from odoo.http import request


class DarAlFatehAPIFull(http.Controller):

    def _success_response(self, data):
        return request.make_response(
            json.dumps({'status': 'success', 'data': data}),
            headers=[
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type, Accept'),
            ]
        )

    def _error_response(self, str_error, status_code=400):
        return request.make_response(
            json.dumps({'status': 'error', 'message': str_error}),
            headers=[
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
            ],
            status=status_code
        )

    # ─── PREFLIGHT ────────────────────────────────────────────────────────────

    @http.route('/api/<path:path>', type='http', auth='public', methods=['OPTIONS'], csrf=False, cors='*')
    def preflight(self, path, **kwargs):
        headers = [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT'),
            ('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type, Accept'),
        ]
        return request.make_response('', headers=headers, status=200)

    # ─── PRODUCTS ─────────────────────────────────────────────────────────────

    @http.route('/api/products', type='http', auth='public', methods=['GET'], csrf=False, cors='*')
    def get_products(self, **kwargs):
        domain = [('is_published', '=', True), ('sale_ok', '=', True)]
        if kwargs.get('category_id'):
            domain.append(('public_categ_ids', 'in', [int(kwargs['category_id'])]))
        limit = int(kwargs.get('limit', 20))
        offset = int(kwargs.get('offset', 0))
        try:
            products = request.env['product.template'].sudo().search(
                domain, limit=limit, offset=offset, order='dar_sort_priority asc, id desc'
            )
            data = [{
                'id': p.id,
                'name': p.name,
                'price': p.list_price,
                'description': p.description_sale or '',
                'category': [{'id': c.id, 'name': c.name} for c in p.public_categ_ids],
                'image_url': f'/web/image/product.template/{p.id}/image_1920' if p.image_1920 else None,
                'is_published': p.is_published,
                'badge': p.dar_badge_label or '',
            } for p in products]
            return self._success_response(data)
        except Exception as e:
            return self._error_response(str(e))

    @http.route('/api/products/<int:product_id>', type='http', auth='public', methods=['GET'], csrf=False, cors='*')
    def get_product_details(self, product_id, **kwargs):
        try:
            p = request.env['product.template'].sudo().browse(product_id)
            if not p.exists():
                return self._error_response('Product not found', 404)
            data = {
                'id': p.id,
                'name': p.name,
                'price': p.list_price,
                'description': p.description_sale or '',
                'category': [{'id': c.id, 'name': c.name} for c in p.public_categ_ids],
                'image_url': f'/web/image/product.template/{p.id}/image_1920' if p.image_1920 else None,
                'badge': p.dar_badge_label or '',
            }
            return self._success_response(data)
        except Exception as e:
            return self._error_response(str(e))

    @http.route('/api/categories', type='http', auth='public', methods=['GET'], csrf=False, cors='*')
    def get_categories(self, **kwargs):
        try:
            cats = request.env['product.public.category'].sudo().search([('parent_id', '=', False)])
            data = [{'id': c.id, 'name': c.name, 'parent_id': c.parent_id.id if c.parent_id else None} for c in cats]
            return self._success_response({'categories': data})
        except Exception as e:
            return self._error_response(str(e))

    # ─── AUTH ─────────────────────────────────────────────────────────────────

    @http.route('/api/login', type='json', auth='public', methods=['POST'], csrf=False, cors='*')
    def login(self, **kwargs):
        email = kwargs.get('email', '').strip()
        password = kwargs.get('password', '')
        if not email or not password:
            return {'status': 'error', 'message': 'Email and password are required.'}
        try:
            request.session.authenticate(
                request.env.cr.dbname,
                email,
                password
            )
            user = request.env.user
            return {
                'status': 'success',
                'data': {
                    'id': user.id,
                    'name': user.name,
                    'email': user.email,
                }
            }
        except Exception:
            return {'status': 'error', 'message': 'Invalid email or password.'}

    @http.route('/api/register', type='json', auth='public', methods=['POST'], csrf=False, cors='*')
    def register(self, **kwargs):
        name = kwargs.get('name', '').strip()
        email = kwargs.get('email', '').strip()
        password = kwargs.get('password', '')
        if not name or not email or not password:
            return {'status': 'error', 'message': 'Name, email and password are required.'}
        try:
            existing = request.env['res.users'].sudo().search([('email', '=', email)], limit=1)
            if existing:
                return {'status': 'error', 'message': 'An account with this email already exists.'}
            user = request.env['res.users'].sudo().create({
                'name': name,
                'login': email,
                'email': email,
                'password': password,
                'groups_id': [(6, 0, [request.env.ref('base.group_portal').id])],
            })
            return {
                'status': 'success',
                'data': {'id': user.id, 'name': user.name, 'email': user.email}
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    # ─── CART ─────────────────────────────────────────────────────────────────

    @http.route('/api/cart/add', type='json', auth='public', methods=['POST'], csrf=False, cors='*')
    def cart_add(self, **kwargs):
        product_id = kwargs.get('product_id')
        quantity = int(kwargs.get('quantity', 1))
        if not product_id:
            return {'status': 'error', 'message': 'product_id is required.'}
        try:
            product = request.env['product.product'].sudo().search(
                [('product_tmpl_id', '=', product_id)], limit=1
            )
            if not product:
                return {'status': 'error', 'message': 'Product not found.'}

            # Get or create the current website sale order (cart)
            order = request.website.sale_get_order(force_create=True)
            order._cart_update(product_id=product.id, add_qty=quantity)
            return {
                'status': 'success',
                'data': {
                    'cart_id': order.id,
                    'cart_name': order.name,
                    'item_count': sum(order.order_line.mapped('product_uom_qty')),
                    'total': order.amount_total,
                }
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    # ─── ORDER ────────────────────────────────────────────────────────────────

    @http.route('/api/order/create', type='json', auth='public', methods=['POST'], csrf=False, cors='*')
    def create_order(self, **kwargs):
        customer_name = kwargs.get('customer_name', '').strip()
        customer_phone = kwargs.get('customer_phone', '').strip()
        address = kwargs.get('address', '').strip()
        lines = kwargs.get('lines', [])

        if not customer_name or not lines:
            return {'status': 'error', 'message': 'customer_name and order lines are required.'}

        try:
            # Find or create a partner
            partner = request.env['res.partner'].sudo().search([('name', '=', customer_name)], limit=1)
            if not partner:
                partner = request.env['res.partner'].sudo().create({
                    'name': customer_name,
                    'phone': customer_phone,
                    'street': address,
                })

            # Build order lines
            order_lines = []
            for line in lines:
                pid = line.get('product_id')
                qty = float(line.get('quantity', 1))
                price = float(line.get('price_unit', 0))
                product = request.env['product.product'].sudo().browse(pid)
                if product.exists():
                    order_lines.append((0, 0, {
                        'product_id': product.id,
                        'product_uom_qty': qty,
                        'price_unit': price or product.lst_price,
                        'name': product.name,
                    }))

            if not order_lines:
                return {'status': 'error', 'message': 'No valid products in order.'}

            sale_order = request.env['sale.order'].sudo().create({
                'partner_id': partner.id,
                'order_line': order_lines,
                'note': f'Delivery Address: {address}',
            })
            sale_order.action_confirm()

            return {
                'status': 'success',
                'data': {
                    'order_id': sale_order.id,
                    'order_name': sale_order.name,
                    'total': sale_order.amount_total,
                    'state': sale_order.state,
                }
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
