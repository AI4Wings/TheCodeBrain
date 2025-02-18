import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog'
import { Loader2, Trash2 } from 'lucide-react'
import type { Playbook } from '../types/playbook'
import { fetchPlaybooks, getBaseUrl } from '../lib/api'

export function PlaybookList() {
  const navigate = useNavigate()
  const [playbooks, setPlaybooks] = useState<Playbook[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlaybooks()
  }, [])

  const loadPlaybooks = async () => {
    try {
      setError(null)
      const data = await fetchPlaybooks()
      setPlaybooks(data)
    } catch (err) {
      setError('Failed to load playbooks. Please try again.')
      console.error('Error loading playbooks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)
      await fetch(`${getBaseUrl()}/playbooks/${id}`, {
        method: 'DELETE',
      })
      await loadPlaybooks()
    } catch (err) {
      setError('Failed to delete playbook. Please try again.')
      console.error('Error deleting playbook:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Playbooks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {playbooks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No playbooks found. Create one to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {playbooks.map((playbook) => (
              <div
                key={playbook.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{playbook.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(playbook.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/playbooks/${playbook.id}`)}
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Playbook</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this playbook? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(playbook.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
