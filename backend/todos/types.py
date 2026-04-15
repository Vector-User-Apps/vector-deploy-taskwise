from __future__ import annotations

from pydantic import BaseModel


class TaskVerdict(BaseModel):
    """The AI's evaluation of whether a task should be added to the todo list."""

    action: str  # "do_now" or "save_for_later"
    reason: str
    estimated_minutes: int
