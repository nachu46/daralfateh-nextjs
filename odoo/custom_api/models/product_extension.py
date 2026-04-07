from odoo import models, fields


class DarAlFatehFeaturedTag(models.Model):
    """Optional model to tag products as featured/promoted on the storefront."""
    _name = 'dar.al.fateh.featured.tag'
    _description = 'Dar Al Fateh Storefront Featured Tag'

    name = fields.Char(string='Tag Name', required=True)
    color = fields.Integer(string='Color Index', default=0)
    product_ids = fields.Many2many(
        'product.template',
        'dar_al_fateh_featured_tag_product_rel',
        'tag_id',
        'product_id',
        string='Featured Products',
    )
    active = fields.Boolean(default=True)

    def name_get(self):
        return [(rec.id, rec.name) for rec in self]


class ProductTemplateFeatured(models.Model):
    """Extends product.template with storefront-specific fields."""
    _inherit = 'product.template'

    dar_featured_tag_ids = fields.Many2many(
        'dar.al.fateh.featured.tag',
        'dar_al_fateh_featured_tag_product_rel',
        'product_id',
        'tag_id',
        string='Storefront Tags',
    )
    dar_sort_priority = fields.Integer(
        string='Storefront Sort Priority',
        default=10,
        help='Lower number = shown first on the frontend.',
    )
    dar_badge_label = fields.Char(
        string='Promotional Badge',
        help='Short text diplayed on the product card, e.g. "NEW" or "-20%".',
    )
