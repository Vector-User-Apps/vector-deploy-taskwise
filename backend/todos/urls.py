from __future__ import annotations

from django.urls import path

from todos.views import EvaluateTaskView, TodoDetailView, TodoListView

urlpatterns = [
    path("evaluate/", EvaluateTaskView.as_view(), name="evaluate-task"),
    path("", TodoListView.as_view(), name="todo-list"),
    path("<str:todo_id>/", TodoDetailView.as_view(), name="todo-detail"),
]
