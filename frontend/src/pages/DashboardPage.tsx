import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@govector/auth'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Check,
  Trash2,
  Zap,
  BookmarkPlus,
  Clock,
  LogOut,
  ListChecks,
  CircleDot,
  BarChart3,
  CreditCard,
} from 'lucide-react'
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@vector-ui'
import { Spinner } from '@/components/ui/Spinner'
import { getUsagePageUrl, getCreditsPageUrl } from '@/utils/hostedPageUrls'
import {
  evaluateTask,
  fetchTodos,
  toggleTodo,
  deleteTodo,
  type TaskVerdict,
  type Todo,
} from '@/services/todos'

function DashboardPage() {
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth()
  const [task, setTask] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [verdict, setVerdict] = useState<TaskVerdict | null>(null)
  const [todos, setTodos] = useState<Todo[]>([])
  const [loadingTodos, setLoadingTodos] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadTodos = useCallback(async () => {
    try {
      const data = await fetchTodos()
      setTodos(data)
    } catch {
      setError('Failed to load todos')
    } finally {
      setLoadingTodos(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadTodos()
    }
  }, [isAuthenticated, loadTodos])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim() || evaluating) return

    setEvaluating(true)
    setVerdict(null)
    setError(null)

    try {
      const result = await evaluateTask(task.trim())
      setVerdict(result)
      setTask('')
      if (result.action === 'save_for_later') {
        await loadTodos()
      }
    } catch {
      setError('Something went wrong evaluating your task. Try again.')
    } finally {
      setEvaluating(false)
      inputRef.current?.focus()
    }
  }

  const handleToggle = async (todoId: string) => {
    try {
      const updated = await toggleTodo(todoId)
      setTodos((prev) => prev.map((t) => (t.id === todoId ? updated : t)))
    } catch {
      setError('Failed to update todo')
    }
  }

  const handleDelete = async (todoId: string) => {
    try {
      await deleteTodo(todoId)
      setTodos((prev) => prev.filter((t) => t.id !== todoId))
    } catch {
      setError('Failed to delete todo')
    }
  }

  const dismissVerdict = () => {
    setVerdict(null)
    inputRef.current?.focus()
  }

  const activeTodos = todos.filter((t) => !t.is_completed)
  const completedTodos = todos.filter((t) => t.is_completed)

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-bg)', fontFamily: 'var(--font-body)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10"
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CircleDot className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
            <span
              className="font-bold text-lg"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-fg)',
              }}
            >
              Todo AI
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-[var(--palette-warm-100)]">
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.full_name}
                    className="h-7 w-7 rounded-full"
                    style={{ border: '1px solid var(--color-border)' }}
                  />
                )}
                <span className="text-sm hidden sm:inline" style={{ color: 'var(--color-text-secondary)' }}>
                  {user?.first_name}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <a href={getUsagePageUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Usage
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={getCreditsPageUrl()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credits
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Task Input */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2
            className="text-lg font-bold mb-1"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-fg)',
            }}
          >
            What's on your mind?
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Type a task and AI will tell you if it's worth adding to your list.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., Reply to Sarah's email about the meeting..."
              disabled={evaluating}
              className="flex-1"
              data-testid="task-input"
            />
            <Button type="submit" disabled={!task.trim() || evaluating} data-testid="submit-task">
              {evaluating ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg p-4 mb-6 text-sm"
              style={{
                background: 'var(--palette-warm-100)',
                color: 'var(--palette-warm-700)',
                border: '1px solid var(--color-border)',
              }}
            >
              {error}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Verdict */}
        <AnimatePresence>
          {verdict && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg p-5 mb-6"
              data-testid="verdict-card"
              style={{
                background:
                  verdict.action === 'do_now'
                    ? 'rgba(245, 158, 11, 0.06)'
                    : 'rgba(94, 106, 210, 0.06)',
                border: `1px solid ${
                  verdict.action === 'do_now'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(94, 106, 210, 0.2)'
                }`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{
                    background:
                      verdict.action === 'do_now'
                        ? 'rgba(245, 158, 11, 0.12)'
                        : 'rgba(94, 106, 210, 0.12)',
                  }}
                >
                  {verdict.action === 'do_now' ? (
                    <Zap className="h-5 w-5" style={{ color: '#D97706' }} />
                  ) : (
                    <BookmarkPlus className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-semibold text-sm"
                      style={{
                        color:
                          verdict.action === 'do_now'
                            ? '#92400E'
                            : 'var(--color-accent)',
                      }}
                    >
                      {verdict.action === 'do_now'
                        ? 'Just do it now'
                        : 'Added to your list'}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background:
                          verdict.action === 'do_now'
                            ? 'rgba(245, 158, 11, 0.12)'
                            : 'rgba(94, 106, 210, 0.12)',
                        color:
                          verdict.action === 'do_now'
                            ? '#92400E'
                            : 'var(--color-accent)',
                      }}
                    >
                      <Clock className="h-3 w-3" />~{verdict.estimated_minutes} min
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}
                  >
                    {verdict.reason}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" onClick={dismissVerdict}>
                  Got it
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Todo List */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
            <h3
              className="font-bold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-fg)',
                fontSize: 'var(--font-size-lg)',
              }}
            >
              Your list
            </h3>
            {activeTodos.length > 0 && (
              <span
                className="text-xs font-medium rounded-full px-2 py-0.5"
                style={{
                  background: 'var(--palette-primary-light)',
                  color: 'var(--color-accent)',
                }}
              >
                {activeTodos.length}
              </span>
            )}
          </div>

          {loadingTodos ? (
            <div className="flex justify-center py-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : todos.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 rounded-lg"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <ListChecks
                className="h-12 w-12 mb-4"
                style={{ color: 'var(--palette-warm-400)' }}
              />
              <p
                className="font-semibold mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-fg)',
                }}
              >
                No tasks yet
              </p>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Enter a task above and let AI decide if it belongs here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Active todos */}
              <AnimatePresence initial={false}>
                {activeTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>

              {/* Completed section */}
              {completedTodos.length > 0 && (
                <>
                  <div className="pt-4 pb-1">
                    <span
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      Completed ({completedTodos.length})
                    </span>
                  </div>
                  <AnimatePresence initial={false}>
                    {completedTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                      />
                    ))}
                  </AnimatePresence>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.15 }}
      className="group flex items-start gap-3 rounded-lg p-4 transition-all"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      data-testid="todo-item"
    >
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full transition-all"
        style={{
          border: todo.is_completed
            ? '2px solid var(--color-accent)'
            : '2px solid var(--palette-warm-300)',
          background: todo.is_completed ? 'var(--color-accent)' : 'transparent',
        }}
        aria-label={todo.is_completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.is_completed && <Check className="h-3 w-3 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium"
          style={{
            color: todo.is_completed ? 'var(--color-muted)' : 'var(--color-fg)',
            textDecoration: todo.is_completed ? 'line-through' : 'none',
          }}
        >
          {todo.task}
        </p>
        <p
          className="text-xs mt-1"
          style={{
            color: 'var(--palette-warm-400)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          {todo.reason}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        <Trash2 className="h-4 w-4" style={{ color: 'var(--palette-warm-400)' }} />
      </Button>
    </motion.div>
  )
}

export default DashboardPage
