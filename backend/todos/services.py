from __future__ import annotations

import json
import logging
import re
from typing import TYPE_CHECKING

from connectors.connector_llm import (
    ChatCompletionRequest,
    ChatMessage,
    ChatRole,
    ConnectorAPIError,
    ConnectorVariant,
    LLMChatRequest,
    call_llm_chat,
)

from todos.types import TaskVerdict

if TYPE_CHECKING:
    from accounts.models import User

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a productivity coach that applies the "two-minute rule" from Getting Things Done.

When a user tells you a task they're considering adding to their todo list, evaluate it and decide:

1. "do_now" — if the task can realistically be done in ~5 minutes or less. These are quick wins: sending a short email, making a quick call, tidying one thing, looking something up, etc.

2. "save_for_later" — if the task genuinely requires focused time, planning, multiple steps, or more than ~5 minutes of effort.

You MUST respond with ONLY valid JSON, no markdown, no code fences, just raw JSON:
{"action": "do_now", "reason": "brief 1-sentence explanation", "estimated_minutes": 3}

Or:
{"action": "save_for_later", "reason": "brief 1-sentence explanation", "estimated_minutes": 30}

Be honest and practical. Don't over-inflate time estimates. Quick tasks are quick — be direct about it."""


def _extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code fences."""
    text = text.strip()
    # Strip markdown code fences if present
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if match:
        text = match.group(1)
    return json.loads(text)


def evaluate_task(task: str, *, user: User) -> TaskVerdict:
    """Ask AI to evaluate whether a task should be saved or done now."""
    request = LLMChatRequest(
        variant=ConnectorVariant.CLAUDE_HAIKU_4_5,
        arguments=ChatCompletionRequest(
            messages=[
                ChatMessage(role=ChatRole.SYSTEM, content=SYSTEM_PROMPT),
                ChatMessage(role=ChatRole.USER, content=task),
            ],
            max_tokens=200,
            temperature=0.3,
        ),
    )

    try:
        response = call_llm_chat(request, user=user)
        content = response.result.content
        logger.info("LLM response content: %s", content[:500] if content else "(empty)")
        data = _extract_json(content)
        return TaskVerdict(
            action=data.get("action", "save_for_later"),
            reason=data.get("reason", "Could not determine."),
            estimated_minutes=data.get("estimated_minutes", 5),
        )
    except ConnectorAPIError:
        logger.exception("LLM connector error during task evaluation")
        raise
    except (json.JSONDecodeError, KeyError, ValueError):
        logger.exception("Failed to parse LLM response")
        return TaskVerdict(
            action="save_for_later",
            reason="I couldn't evaluate this task properly, so I've added it to your list to be safe.",
            estimated_minutes=5,
        )
