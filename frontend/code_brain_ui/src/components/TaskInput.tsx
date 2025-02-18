import { useState, useEffect } from 'react'
import { Textarea } from '../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Loader2 } from 'lucide-react'
import type { Playbook } from '../types/playbook'
import { useNavigate } from 'react-router-dom'
import { fetchPlaybooks, createTask } from '../lib/api'

export function TaskInput() {
  const [taskDescription, setTaskDescription] = useState('')
  const [selectedPlaybook, setSelectedPlaybook] = useState('')
  const [playbooks, setPlaybooks] = useState<Playbook[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPlaybooks = async () => {
      try {
        setError(null)
        const data = await fetchPlaybooks()
        setPlaybooks(data)
      } catch (err) {
        setError('Failed to load playbooks. Please try again.')
        console.error('Error loading playbooks:', err)
      }
    }

    loadPlaybooks()
  }, [])

  const navigate = useNavigate()
  
  const handleSubmit = async () => {
    if (!taskDescription.trim()) {
      setError('Please enter a task description')
      return
    }

    try {
      setError(null)
      setLoading(true)
      const task = await createTask(taskDescription, selectedPlaybook || undefined)
      setTaskDescription('')
      setSelectedPlaybook('')
      navigate(`/tasks/${task.id}`)
    } catch (err) {
      setError('Failed to create task. Please try again.')
      console.error('Error creating task:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Task Description</label>
          <Textarea
            placeholder="Describe your task in natural language..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="min-h-32"
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Playbook (Optional)</label>
          <Select 
            value={selectedPlaybook} 
            onValueChange={setSelectedPlaybook}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a playbook..." />
            </SelectTrigger>
            <SelectContent>
              {playbooks.map((playbook) => (
                <SelectItem key={playbook.id} value={playbook.id}>
                  {playbook.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Task...
            </>
          ) : (
            'Create Task'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
