{
    "name": "Luxury Shopify-Style Shop UI",
    "version": "1.0",
    "category": "Website/Website",
    "summary": "Modern premium eCommerce UI for Odoo 18 with a luxury beige theme.",
    "description": """
        Customizes the Odoo 18 shop with:
        - Clean, minimal luxury beige color palette.
        - Tight Shopify-style product grid (5/3/2).
        - Product image swap on hover.
        - Premium category cards with lift animation.
        - Sticky header with Shopify-style mega menu.
        - Modern 'Inter' typography.
    """,
    "author": "Antigravity",
    "website": "https://www.daralfateh.com",
    "depends": ["website_sale", "website_wishlist"],
    "data": [
        "views/shop_templates.xml",
        "views/category_templates.xml",
        "views/header_templates.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            "website_shop_luxury/static/src/scss/luxury_theme.scss",
        ],
    },
    "installable": true,
    "application": false,
    "license": "LGPL-3",
}
