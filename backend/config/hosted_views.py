"""
Forwarding view: renders an auto-submitting HTML form that POSTs the
UGA JWT cookie to the Vector BE hosted page endpoint.

All validation (page allowlisting, token verification, app-id matching)
is handled by Vector BE. This view just checks the user is logged in,
grabs their UGA JWT cookie, and sends them on their way.
"""

from __future__ import annotations

import os
from html import escape

from django.http import HttpResponse
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.views import APIView

# Only these page names are allowed — prevents XSS via crafted URL paths.
VALID_HOSTED_PAGES = {"pricing", "billing", "usage", "credits"}

# Cookie name where the original UGA JWT is stored (set during auth callback).
UGA_JWT_COOKIE = "uga_jwt"

# Services that require authentication (billing/usage/credits need user context).
# Pricing is public — no login needed.
AUTH_REQUIRED_PAGES = {"billing", "usage", "credits"}


class HostedPageForwardView(APIView):
    """Render an auto-submit form that POSTs the UGA token to Vector BE.

    Uses DRF's APIView so JWTCookieAuthentication runs and request.user
    is properly set from the access_token HttpOnly cookie.

    Public pages (pricing) allow unauthenticated access.
    Authenticated pages (usage, credits) require login.
    """

    def get_permissions(self):
        page = self.kwargs.get("page", "").strip("/") or "usage"
        if page in AUTH_REQUIRED_PAGES:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request: Request, page=""):
        # Validate page against allowlist (prevents XSS via URL path injection)
        page = page.strip("/") or "usage"
        if page not in VALID_HOSTED_PAGES:
            return HttpResponse("Unknown hosted page.", status=400)

        vector_api_url = os.getenv("VECTOR_API_URL", "")
        if not vector_api_url:
            return HttpResponse("VECTOR_API_URL must be set.", status=400)

        # For authenticated pages, forward the UGA JWT
        if page in AUTH_REQUIRED_PAGES:
            token = request.COOKIES.get(UGA_JWT_COOKIE, "")
            if not token:
                return HttpResponse("No auth token found. Please log in again.", status=400)
        else:
            # Public pages (pricing) — no token needed, but still forward if available
            token = request.COOKIES.get(UGA_JWT_COOKIE, "")

        base_url = vector_api_url.rstrip("/")

        # Preserve query string (e.g., ?tab=credits) for the final redirect
        query_string = request.META.get("QUERY_STRING", "")
        qs_suffix = f"?{query_string}" if query_string else ""

        if token:
            # Authenticated: auto-submit form to POST token to Vector
            # Pass query_string as hidden field so backend can forward it
            target_url = f"{base_url}/api/hosted/redirect/{escape(page)}/"
            html = f"""<!DOCTYPE html>
<html>
<head><title>Redirecting...</title></head>
<body>
    <form id="hosted-form" method="POST" action="{escape(target_url)}">
        <input type="hidden" name="token" value="{escape(token)}">
        <input type="hidden" name="query_string" value="{escape(query_string)}">
    </form>
    <script>document.getElementById('hosted-form').submit();</script>
</body>
</html>"""
        else:
            # Public page without token — redirect directly using app slug
            slug = os.getenv("VECTOR_APP_SLUG", "")
            if not slug:
                return HttpResponse("VECTOR_APP_SLUG must be set.", status=400)
            target_url = f"{base_url}/api/hosted/{escape(page)}/{escape(slug)}/{escape(qs_suffix)}"
            html = f"""<!DOCTYPE html>
<html>
<head><meta http-equiv="refresh" content="0;url={target_url}"></head>
<body><a href="{target_url}">Redirecting...</a></body>
</html>"""

        return HttpResponse(html, content_type="text/html")
