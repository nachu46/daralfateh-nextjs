/**
 * Server-side Odoo JSON-RPC client.
 * NEVER import this from client components — server use only.
 */

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;

let cachedUid: number | null = null;

async function getUid(): Promise<number> {
  if (cachedUid) return cachedUid;
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: 1,
      params: {
        service: 'common', method: 'authenticate',
        args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
      },
    }),
    cache: 'no-store',
  });

  const text = await res.text();
  let json: { result?: number; error?: { data?: { message?: string } } };
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error('[Odoo Auth Error] Expected JSON, got:', text.substring(0, 100));
    throw new Error(`Odoo returned an invalid response (HTML instead of JSON). This usually means the Cloudflare tunnel or Odoo instance is down. URL: ${ODOO_URL}`);
  }

  if (!json.result) {
    console.error('[Odoo Auth Failed]', json);
    throw new Error('Odoo authentication failed. Please check your credentials and database name.');
  }
  cachedUid = json.result;
  return json.result;
}

export async function callOdoo<T>(model: string, method: string, args: unknown[], kwargs: Record<string, unknown> = {}): Promise<T> {
  const uid = await getUid();
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: 2,
      params: {
        service: 'object', method: 'execute_kw',
        args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
      },
    }),
    next: { revalidate: 60 }, // cache 60s
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.data?.message || 'Odoo RPC error');
  return json.result as T;
}

export interface OdooProduct {
  id: number;
  name: string;
  list_price: number;
  public_categ_ids: number[];
  is_published: boolean;
  description_sale: string | false;
  product_variant_id: [number, string] | number;
  product_tmpl_id: [number, string] | number;
  product_variant_ids?: number[];
  attribute_line_ids?: number[];
  product_template_attribute_value_ids?: number[];
  product_template_image_ids?: number[];
  website_description?: string;
  description_ecommerce?: string;
  description?: string;
}

export interface OdooCategory {
  id: number;
  name: string;
  parent_id: number[] | false;
}

interface OdooAttributeLine {
  id: number;
  attribute_id: [number, string];
  product_template_value_ids: number[];
}

interface OdooAttributeValue {
  id: number;
  name: string;
  product_attribute_value_id: [number, string];
}

/**
 * Generates an Odoo image URL for a given model and ID
 */
export function getOdooImageUrl(model: string, id: number, field: string = 'image_512') {
  return `/api/image?model=${model}&id=${id}&field=${field}`;
}

export function getProductImageUrl(id: number) {
  // Use our local proxy to ensure images load via JSON-RPC
  return `/api/product-image/${id}`;
}

export function getCategoryImageUrl(id: number, size: 128 | 256 | 512 | 1024 = 512) {
  return getOdooImageUrl('product.public.category', id, `image_${size}`);
}

export async function fetchProducts(params?: { limit?: number; offset?: number; categoryId?: number }) {
  const domain: unknown[][] = [['sale_ok', '=', true], ['is_published', '=', true]];
  if (params?.categoryId) {
    domain.push(['public_categ_ids', 'in', [params.categoryId]]);
  }
    const products = await callOdoo<OdooProduct[]>(
    'product.template', 'search_read', [domain],
    {
      fields: ['id', 'name', 'list_price', 'public_categ_ids', 'is_published', 'description_sale', 'product_variant_id', 'product_template_image_ids'],
      limit: params?.limit || 20,
      offset: params?.offset || 0,
      order: 'website_sequence asc, id asc',
    }
  );
  return products.map(p => {
    // Determine the most stable ID (priority: Variant ID > Template ID)
    let finalId = p.id;
    if (Array.isArray(p.product_variant_id)) {
      finalId = p.product_variant_id[0];
    } else if (typeof p.product_variant_id === 'number') {
      finalId = p.product_variant_id;
    }

    return {
      id: finalId,
      name: p.name,
      price: p.list_price || 0,
      image_url: getProductImageUrl(p.id, 512),
      hover_image_url: (p.product_template_image_ids && p.product_template_image_ids.length > 0) 
        ? getOdooImageUrl('product.image', p.product_template_image_ids[0], 'image_512') 
        : null,
      category: Array.isArray(p.public_categ_ids)
        ? p.public_categ_ids.map(id => ({ id, name: '' }))
        : [],
      description: typeof p.description_sale === 'string' ? p.description_sale : '',
    };
  });
}

export async function fetchProductById(id: number) {
  // 1. Fetch the primary variant/product
  const variantRecord = await callOdoo<OdooProduct[]>(
    'product.product', 'search_read', [[['id', '=', id]]],
    {
      fields: ['id', 'name', 'list_price', 'public_categ_ids', 'is_published', 'description_sale', 'product_tmpl_id', 'product_template_attribute_value_ids'],
      limit: 1
    }
  );
  if (!variantRecord.length) return null;
  const v = variantRecord[0];
  const templateId = Array.isArray(v.product_tmpl_id) ? v.product_tmpl_id[0] : v.id;

  // 2. Fetch the template to get variants, attributes, extra images, AND all description fields
  const templateRecord = await callOdoo<OdooProduct[]>(
    'product.template', 'read', [[templateId], ['name', 'description_sale', 'website_description', 'description_ecommerce', 'description', 'product_variant_ids', 'attribute_line_ids', 'public_categ_ids', 'product_template_image_ids']]
  );
  if (!templateRecord.length) return null;
  const t = templateRecord[0];

  // 3. Fetch Attribute Lines for the template
  const attrLines = t.attribute_line_ids?.length ? await callOdoo<OdooAttributeLine[]>(
    'product.template.attribute.line', 'read', [t.attribute_line_ids, ['attribute_id', 'product_template_value_ids']]
  ) : [];

  // 4. Fetch the Attribute Values for those lines
  const attributes = await Promise.all(attrLines.map(async (al) => {
    const values = await callOdoo<OdooAttributeValue[]>(
      'product.template.attribute.value', 'read', [al.product_template_value_ids, ['id', 'name', 'product_attribute_value_id']]
    );
    return {
      id: al.attribute_id[0],
      name: al.attribute_id[1],
      values: values.map(v => ({ id: v.id, name: v.name }))
    };
  }));

  // 5. Fetch All Variants for the template
  const allVariants = await callOdoo<OdooProduct[]>(
    'product.product', 'read', [t.product_variant_ids || [], ['id', 'name', 'list_price', 'product_template_attribute_value_ids']]
  );

  const extraImages = (t.product_template_image_ids || []).map(imgId => 
    getOdooImageUrl('product.image', imgId, 'image_1024')
  );

  return {
    id: v.id,
    name: t.name,
    price: v.list_price || 0,
    image_url: getProductImageUrl(templateId, 1024),
    extra_images: extraImages,
    category: Array.isArray(t.public_categ_ids) ? t.public_categ_ids.map(catId => ({ id: catId, name: '' })) : [],
    description: typeof t.description_sale === 'string' ? t.description_sale : '',
    internal_description: typeof t.description === 'string' ? t.description : '',
    website_description: typeof t.website_description === 'string' ? t.website_description : null,
    ecommerce_description: typeof t.description_ecommerce === 'string' ? t.description_ecommerce : null,
    attributes,
    variants: allVariants.map(av => ({
      id: av.id,
      name: av.name,
      price: av.list_price || 0,
      attribute_value_ids: av.product_template_attribute_value_ids || []
    }))
  };
}

export async function fetchCategories() {
  try {
    const cats = await callOdoo<OdooCategory[]>(
      'product.public.category', 'search_read', [[]],
      {
        fields: ['id', 'name', 'parent_id'],
        limit: 100
      }
    );
    return cats.map(cat => ({
      ...cat,
      image_url: getCategoryImageUrl(cat.id, 1024)
    }));
  } catch (err) {
    console.warn('[Odoo] fetchCategories error:', err);
    return [];
  }
}

/**
 * Creates or updates a guest partner in Odoo based on email
 */
export async function createOrUpdatePartner(details: {
  name: string;
  email: string;
  phone: string;
  street: string;
  city?: string;
  zip?: string;
  country_name?: string
}) {
  try {
    // 1. Search for existing partner by email
    const existing = await callOdoo<{ id: number }[]>('res.partner', 'search_read', [[['email', '=', details.email]]], { limit: 1, fields: ['id'] });

    if (existing.length) {
      const partnerId = existing[0].id;
      // 2. Update existing partner with latest details
      await callOdoo('res.partner', 'write', [[partnerId], {
        name: details.name,
        phone: details.phone,
        street: details.street,
        city: details.city,
        zip: details.zip,
        // We'll keep country as a string in Odoo's city/street block for simplicity unless Odoo requires ID
      }]);
      return partnerId;
    } else {
      // 3. Create new guest partner
      return await callOdoo<number>('res.partner', 'create', [{
        name: details.name,
        email: details.email,
        phone: details.phone,
        street: details.street,
        city: details.city,
        zip: details.zip,
        is_company: false,
        customer_rank: 1,
      }]);
    }
  } catch (err) {
    console.error('[Odoo] createOrUpdatePartner error:', err);
    throw new Error('Failed to synchronize customer details with Odoo.');
  }
}

/**
 * Creates a Sale Order in Odoo (draft) and returns the Order ID
 */
export async function createSaleOrder(
  partnerId: number, 
  items: { id: number; quantity: number }[],
  invoicePartnerId?: number,
  shippingPartnerId?: number
) {
  const orderLines = items.map(item => [
    0, 0, {
      product_id: item.id, // Must be product.product ID
      product_uom_qty: item.quantity,
    }
  ]);

  return callOdoo<number>('sale.order', 'create', [{
    partner_id: partnerId,
    partner_invoice_id: invoicePartnerId || partnerId,
    partner_shipping_id: shippingPartnerId || partnerId,
    order_line: orderLines,
    state: 'draft', // Ensure it starts as draft
  }]);
}

/**
 * Confirms a Sale Order (draft -> sale)
 */
export async function confirmSaleOrder(orderId: number) {
  try {
    await callOdoo('sale.order', 'action_confirm', [[orderId]]);
    return true;
  } catch (err) {
    console.error('[Odoo] confirmSaleOrder error:', err);
    throw new Error('Order confirmation in Odoo failed.');
  }
}

/**
 * Explicitly triggers the Odoo Sales Confirmation Email
 */
export async function sendOrderConfirmationEmail(orderId: number) {
  try {
    // 1. Find the Sale Order confirmation template
    const templates = await callOdoo<{ id: number }[]>('mail.template', 'search_read', [
      [['name', 'ilike', 'Sales: Order Confirmation']]
    ], { limit: 1, fields: ['id'] });

    if (templates.length) {
      // 2. Send the mail
      await callOdoo('mail.template', 'send_mail', [templates[0].id, orderId], { force_send: true });
      return true;
    }
    
    // Fallback search
    const fallbackTemplates = await callOdoo<{ id: number }[]>('mail.template', 'search_read', [
      [['model', '=', 'sale.order'], ['name', 'ilike', 'Confirmation']]
    ], { limit: 1, fields: ['id'] });

    if (fallbackTemplates.length) {
        await callOdoo('mail.template', 'send_mail', [fallbackTemplates[0].id, orderId], { force_send: true });
        return true;
    }

    console.warn('[Odoo] No confirmation template found to send.');
    return false;
  } catch (err) {
    console.error('[Odoo] sendOrderConfirmationEmail error:', err);
    return false;
  }
}

/**
 * Generates the Odoo Portal URL for a specific order (for native payment)
 */
export async function getPaymentLink(orderId: number) {
  try {
    const orders = await callOdoo<{ access_url: string }[]>('sale.order', 'search_read', [[['id', '=', orderId]]], {
      fields: ['access_url'],
      limit: 1
    });

    if (orders.length && orders[0].access_url) {
      return `${ODOO_URL}${orders[0].access_url}`;
    }

    // Fallback to standard portal link
    return `${ODOO_URL}/my/orders/${orderId}`;
  } catch (err) {
    console.error('[Odoo] getPaymentLink error:', err);
    return `${ODOO_URL}/my/orders/${orderId}`;
  }
}

/**
 * Finds a public partner ID or falls back to admin
 */
export async function getPublicPartnerId() {
  try {
    const partners = await callOdoo<{ id: number }[]>('res.partner', 'search_read', [[['name', '=', 'Public user']]], { limit: 1, fields: ['id'] });
    return partners.length ? partners[0].id : 1; // Fallback to 1 or admin
  } catch {
    return 1;
  }
}

/**
 * Tracks an order by its reference name (e.g., S00010) and customer email.
 * Securely cross-references the partner's email.
 */
export async function trackOrder(orderRef: string, email: string) {
  try {
    // Strip # or whitespace
    const cleanRef = orderRef.replace(/^#+/, '').trim();
    
    // Search flexibly: exact match, or ends with the number they typed (in case Odoo stripped S0 prefixes)
    const orders = await callOdoo<any[]>('sale.order', 'search_read', [
       ['|', ['name', 'ilike', cleanRef], ['id', '=', isNaN(Number(cleanRef)) ? 0 : Number(cleanRef)]]
    ], {
      fields: ['id', 'name', 'state', 'amount_total', 'date_order', 'partner_id'],
      limit: 1
    });

    console.log(`[Tracking] Searched for: ${cleanRef}, Found: ${orders.length ? orders[0].name : 'None'}`);

    if (!orders.length) return null;
    const order = orders[0];

    const partnerId = order.partner_id[0];
    const partners = await callOdoo<any[]>('res.partner', 'search_read', [
      [['id', '=', partnerId]]
    ], { fields: ['email'], limit: 1 });

    const partnerEmail = (partners[0]?.email || '').toLowerCase().trim();
    const inputEmail = email.toLowerCase().trim();

    console.log(`[Tracking] Comparing emails: Odoo (${partnerEmail}) vs Input (${inputEmail})`);

    if (partnerEmail !== inputEmail) {
       console.log(`[Tracking] Security match failed. Incorrect Email.`);
       return null; // Security check failed
    }

    return {
      orderNumber: order.name,
      status: order.state,
      total: order.amount_total,
      date: order.date_order,
      customerName: order.partner_id[1]
    };
  } catch (err) {
    console.error('[Odoo] trackOrder error:', err);
    return null;
  }
}
