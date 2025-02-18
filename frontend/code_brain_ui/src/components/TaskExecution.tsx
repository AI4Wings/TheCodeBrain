import { API_URL } from '../lib/api'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import type { Task, PlanStep } from '../types/task'
import { AnalysisReport } from './AnalysisReport'
import { TaskPrompt } from './TaskPrompt'

export function TaskExecution() {
  const { taskId } = useParams()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [interacting, setInteracting] = useState(false)

  const fetchTask = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const response = await fetch(`${API_URL}/api/v1/tasks/${taskId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch task')
      }
      const data = await response.json()
      setTask(data)
    } catch (err) {
      setError('Failed to load task. Please try again.')
      console.error('Error loading task:', err)
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    fetchTask()
  }, [fetchTask])

  const confirmPlan = async () => {
    if (!task) return

    try {
      setError(null)
      setLoading(true)
      const response = await fetch(`${API_URL}/api/v1/tasks/${taskId}/confirm`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to confirm task')
      }
      const data = await response.json()
      setTask(data)
    } catch (err) {
      setError('Failed to confirm task. Please try again.')
      console.error('Error confirming task:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderPlanSteps = (steps: PlanStep[]) => {
    return steps.map((step) => (
      <div
        key={step.id}
        className="flex items-center space-x-2 p-2 border rounded-lg"
      >
        {step.status === 'completed' ? (
          <CheckCircle2 className="text-green-500" />
        ) : step.status === 'failed' ? (
          <XCircle className="text-red-500" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
        )}
        <span>{step.description}</span>
      </div>
    ))
  }

  if (loading && !task) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!task) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Task not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Task Execution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h3 className="font-medium">Task Description</h3>
          <p className="text-muted-foreground">{task.description}</p>
        </div>

        {task.plan && (
          <div className="space-y-2">
            <h3 className="font-medium">Execution Plan</h3>
            <div className="space-y-2">
              {renderPlanSteps(task.plan.steps)}
            </div>
            {task.status === 'awaiting_confirmation' && (
              <Button
                onClick={confirmPlan}
                disabled={loading}
                className="mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'Confirm and Start Execution'
                )}
              </Button>
            )}
          </div>
        )}

        {task.results && task.status === 'completed' && 'ui_impacts' in task.results ? (
          <AnalysisReport results={task.results} />
        ) : task.messages && task.messages.length > 0 ? (
          <TaskPrompt
            message={task.messages[task.messages.length - 1].content}
            onSubmit={async (input) => {
              try {
                setInteracting(true);
                setError(null);
                const response = await fetch(`${API_URL}/api/v1/tasks/${taskId}/interact`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ input }),
                });
                
                if (!response.ok) {
                  throw new Error('Failed to send interaction');
                }
                
                const updatedTask = await response.json();
                setTask(updatedTask);
              } catch (err) {
                setError('Failed to send interaction. Please try again.');
                console.error('Error sending interaction:', err);
              } finally {
                setInteracting(false);
              }
            }}
            loading={interacting}
            error={error}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
