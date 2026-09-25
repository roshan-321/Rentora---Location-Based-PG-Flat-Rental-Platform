from django.views.generic.base import TemplateView


class PropertyListRenderView(TemplateView):
    template_name = 'property_list.html'

class AddPropertyRenderView(TemplateView):
    template_name = 'add_property.html'


class PropertyEditRenderView(TemplateView):
    template_name = 'property_edit.html'


class PropertyViewRenderView(TemplateView):
    template_name = 'property_view.html'