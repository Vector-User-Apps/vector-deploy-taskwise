from __future__ import annotations

from rest_framework import serializers

from todos.models import Todo


class EvaluateTaskSerializer(serializers.Serializer):
    task = serializers.CharField(max_length=500, min_length=1)


class TaskVerdictSerializer(serializers.Serializer):
    action = serializers.CharField()
    reason = serializers.CharField()
    estimated_minutes = serializers.IntegerField()
    todo_id = serializers.UUIDField(required=False, allow_null=True)


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ["id", "task", "reason", "is_completed", "created_at"]
        read_only_fields = ["id", "task", "reason", "created_at"]
