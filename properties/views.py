from django.views.generic.base import TemplateView


class PropertyListRenderView(TemplateView):
    template_name = 'property_list.html'

class AddPropertyRenderView(TemplateView):
    template_name = 'add_property.html'