from django.views.generic.base import TemplateView


class HomeRenderView(TemplateView):
    template_name = 'home.html'


class AboutRenderView(TemplateView):
    template_name = 'about.html'


