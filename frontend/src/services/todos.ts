import { api } from '@/services/api'

export interface TaskVerdict {
  action: 'do_now' | 'save_for_later'
  reason: string
  estimated_minutes: number
  todo_id: string | null
}

export interface Todo {
  id: string
  task: string
  reason: string
  is_completed: boolean
  created_at: string
}

export async function evaluateTask(task: string): Promise<TaskVerdict> {
  const response = await api.post<TaskVerdict>('/api/todos/evaluate/', { task })
  return response.data
}

export async function fetchTodos(): Promise<Todo[]> {
  const response = await api.get<Todo[]>('/api/todos/')
  return response.data
}

export async function toggleTodo(todoId: string): Promise<Todo> {
  const response = await api.patch<Todo>(`/api/todos/${todoId}/`)
  return response.data
}

export async function deleteTodo(todoId: string): Promise<void> {
  await api.delete(`/api/todos/${todoId}/`)
}
