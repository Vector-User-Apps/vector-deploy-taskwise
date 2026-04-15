from __future__ import annotations

from django.contrib import admin
from django.urls import include, path, re_path

from config.hosted_views import HostedPageForwardView
from config.views import spa_index

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/todos/", include("todos.urls")),
    path("api/hosted/", HostedPageForwardView.as_view()),
    path("api/hosted/<path:page>/", HostedPageForwardView.as_view()),
    # SPA catch-all: serve index.html for any route not matched above.
    # This lets React Router handle client-side routing in production.
    # Must be last — Django tries patterns in order.
    re_path(r"^(?!api/|admin/|static/|assets/).*$", spa_index),
]
