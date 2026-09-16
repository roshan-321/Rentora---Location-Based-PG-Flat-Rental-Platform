from django.views.generic.base import TemplateView


class UserRegisterRenderView(TemplateView):
    template_name = 'user_register.html'


class UserLoginRenderView(TemplateView):
    template_name = 'user_login.html'