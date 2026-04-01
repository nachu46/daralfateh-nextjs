import json
from odoo import http
from odoo.http import request

class DarAlFatehAPI(http.Controller):

    def _success_response(self, data):
        return request.make_response(
            json.dumps({'status': 'success', 'data': data}),
            headers=[
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type, Accept')
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

    # Preflight handler
    @http.route('/api/<path:path>', type='http', auth='public', methods=['OPTIONS'], csrf=False, cors='*')
    def preflight(self, path, **kwargs):
        headers = [
            ('Access-Control-Allow-Origin', '*'),
            ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE, PUT'),
            ('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type, Accept')
        ]
        return request.make_response('', headers=headers, status=200)

    @http.route('/api/products', type='http', auth='public', methods=['GET'], csrf=False, cors='*')
    def get_products(self, **kwargs):
        domain = [('is_published', '=', True), ('sale_ok', '=', True)]
        if kwargs.get('category_id'):
            domain.append(('public_categ_ids', 'in', [int(kwargs.get('category_id'))]))
        limit = int(kwargs.get('limit', 20))
        offset = int(kwargs.get('offset', 0))

        try:
            products = request.env['product.template'].sudo().search(domain, limit=limit, offset=offset)
            data = []
            for p in products:
                data.append({
                    'id': p.id,
                    'name': p.name,
                    'price': p.list_price,
                    'description': p.description_sale or '',
                    'category': [{'id': c.id, 'name': c.name} for c in p.public_categ_ids],
                    'image_url': f'/web/image/product.template/{p.id}/image_1920' if p.image_1920 else None
                })
            return self._success_response(data)
        except Exception as e:
            return self._error_response(str(e))

    @http.route('/api/products/<int:product_id>', type='http', auth='public', methods=['GET'], csrf=False, cors='*')
    def get_product_details(self, product_id, **kwargs):
        try:
            p = request.env['product.template'].sudo().search([('id', '=', product_id)])
            if not p:
                return self._error_response('Product not found', 404)
            data = {
                'id': p.id,
                'name': p.name,
                'price': p.list_price,
                'description': p.description_sale or '',
                'category': [{'id': c.id, 'name': c.name} for c in p.public_categ_ids],
                'image_url': f'/web/image/product.template/{p.id}/image_1920' if p.image_1920 else None
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

# Endpoints for Auth, Cart, and Order should be implemented similarly based on standard ecommerce flows.
