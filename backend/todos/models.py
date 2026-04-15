from __future__ import annotations

from django.conf import settings
from django.db import models

from shared.models import BaseModel


class Todo(BaseModel):
    """A task that passed AI gatekeeper evaluation and is worth tracking."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="todos",
    )
    task = models.CharField(max_length=500)
    reason = models.TextField(
        help_text="AI's explanation for why this task belongs on the list.",
    )
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.task
