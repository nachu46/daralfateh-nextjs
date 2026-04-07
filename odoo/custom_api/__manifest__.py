# -*- coding: utf-8 -*-
{
    'name': 'Dar Al Fateh — Custom API',
    'version': '17.0.1.0.0',
    'summary': 'Headless REST API for the Dar Al Fateh eCommerce frontend',
    'description': """
        Provides lightweight JSON REST endpoints for the Next.js frontend:
        - GET  /api/products          — published product list with filtering & pagination
        - GET  /api/products/<id>     — single product detail
        - GET  /api/categories        — top-level product categories
        - POST /api/login             — session authentication
        - POST /api/register          — portal user registration
        - POST /api/cart/add          — add item to website sale order (cart)
        - POST /api/order/create      — confirm a new sale order
        All endpoints support CORS for cross-origin Next.js requests.
    """,
    'author': 'Dar Al Fateh International',
    'website': 'https://daralfateh.ae',
    'category': 'eCommerce',
    'depends': ['base', 'sale_management', 'website_sale', 'auth_signup'],
    'data': [],
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
