import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Loader2 } from 'lucide-react'
import type { PlaybookCreate } from '../types/playbook'

interface PlaybookEditorProps {
  onSubmit: (playbook: PlaybookCreate) => Promise<void>
  initialData?: PlaybookCreate
}

export function PlaybookEditor({ onSubmit, initialData }: PlaybookEditorProps) {
  const navigate = useNavigate()
  const [name, setName] = useState(initialData?.name || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!name.trim() || !content.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setError(null)
      setLoading(true)
      await onSubmit({ name, content })
      navigate('/playbooks')
    } catch (err) {
      setError('Failed to save playbook. Please try again.')
      console.error('Error saving playbook:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create Playbook</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Playbook Name</label>
          <Input
            placeholder="Enter playbook name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content (Markdown)</label>
          <Textarea
            placeholder="Write your playbook content in Markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-64 font-mono"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/playbooks')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Playbook'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
