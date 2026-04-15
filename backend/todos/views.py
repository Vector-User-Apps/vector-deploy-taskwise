from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

import httpx

from connectors.connector_llm import ConnectorAPIError
from todos.models import Todo
from todos.serializers import EvaluateTaskSerializer, TaskVerdictSerializer, TodoSerializer
from todos.services import evaluate_task

logger = logging.getLogger(__name__)


class EvaluateTaskView(APIView):
    """Evaluate a task using AI and optionally save it."""

    def post(self, request: Request) -> Response:
        serializer = EvaluateTaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task_text: str = serializer.validated_data["task"]

        try:
            verdict = evaluate_task(task_text, user=request.user)
        except (ConnectorAPIError, httpx.HTTPStatusError):
            logger.exception("LLM connector error evaluating task")
            return Response(
                {"detail": "AI evaluation is temporarily unavailable. Please try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        todo_id = None
        if verdict.action == "save_for_later":
            todo = Todo.objects.create(
                user=request.user,
                task=task_text,
                reason=verdict.reason,
            )
            todo_id = todo.id

        return Response(
            TaskVerdictSerializer(
                {
                    "action": verdict.action,
                    "reason": verdict.reason,
                    "estimated_minutes": verdict.estimated_minutes,
                    "todo_id": todo_id,
                }
            ).data,
            status=status.HTTP_200_OK,
        )


class TodoListView(APIView):
    """List all todos for the current user."""

    def get(self, request: Request) -> Response:
        todos = Todo.objects.filter(user=request.user)
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)


class TodoDetailView(APIView):
    """Toggle completion or delete a todo."""

    def patch(self, request: Request, todo_id: str) -> Response:
        try:
            todo = Todo.objects.get(id=todo_id, user=request.user)
        except Todo.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        todo.is_completed = not todo.is_completed
        todo.save(update_fields=["is_completed", "updated_at"])
        return Response(TodoSerializer(todo).data)

    def delete(self, request: Request, todo_id: str) -> Response:
        try:
            todo = Todo.objects.get(id=todo_id, user=request.user)
        except Todo.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
