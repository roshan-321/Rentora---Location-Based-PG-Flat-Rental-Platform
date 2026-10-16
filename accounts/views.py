from django.views.generic.base import TemplateView
from django.views.generic.base import TemplateView
from django.conf import settings


class GoogleCallbackRenderView(TemplateView):
    template_name = "google_callback.html"

class UserRegisterRenderView(TemplateView):
    template_name = 'user_register.html'

class UserLoginRenderView(TemplateView):
    template_name = 'user_login.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["google_client_id"] = settings.GOOGLE_OAUTH_CLIENT_ID
        context["google_redirect_uri"] = settings.GOOGLE_OAUTH_CALLBACK_URL
        return context

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

class UserRoleRenderView(TemplateView):
    template_name = "user_role.html"