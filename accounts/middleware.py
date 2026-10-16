
from django.http import JsonResponse, HttpResponseRedirect
from rest_framework_simplejwt.authentication import JWTAuthentication


class RoleMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response
        self.jwt_auth = JWTAuthentication()

    def __call__(self, request):

        path = request.path

        # Public pages
        public_pages = [
            "/",
            "/accounts/user/signin",
            "/accounts/user/signup",
            "/about",
            "/properties/list",
        ]

        if path in public_pages:
            return self.get_response(request)

        # Role selection page
        if path in [
            "/accounts/user/role",
            "/accounts/user/role/",
            "/api/accounts/user/role"
        ]:
            return self.get_response(request)

        # Google authentication endpoints
        if (
            path.startswith("/accounts/google/")
            or path.startswith("/api/accounts/google/")
        ):
            return self.get_response(request)

        # Authentication API
        if path in [
            "/api/accounts/auth",
            "/api/accounts/auth/",
        ]:
            return self.get_response(request)

        # API requests: check JWT and role
        if path.startswith("/api/"):

            try:
                result = self.jwt_auth.authenticate(request)

                if result:
                    user, token = result

                    if not user.role and not user.is_superuser:
                        return JsonResponse(
                            {"error": "ROLE_NOT_SET"},
                            status=403
                        )

            except Exception:
                pass

            return self.get_response(request)

        # Normal Django pages
        user = request.user

        if user.is_authenticated:
            if (
                not user.role
                and not user.is_superuser
            ):
                return HttpResponseRedirect(
                    "/accounts/user/role"
                )

        return self.get_response(request)
