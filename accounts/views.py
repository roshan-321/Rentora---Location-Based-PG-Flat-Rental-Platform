from django.views.generic.base import TemplateView


class UserRegisterRenderView(TemplateView):
    template_name = 'user_register.html'


class UserLoginRenderView(TemplateView):
    template_name = 'user_login.html'

class UserProfileRenderView(TemplateView):
    template_name = 'user_profile.html'

class EditProfileRenderView(TemplateView):
    template_name = "edit_profile.html"

class UserListRenderView(TemplateView):
    template_name = "user_list.html"


class UserViewRenderView(TemplateView):
    template_name = "user_view.html"


class UserEditRenderView(TemplateView):
    template_name = "user_edit.html"