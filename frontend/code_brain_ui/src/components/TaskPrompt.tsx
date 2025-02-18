import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'

interface TaskPromptProps {
  message: string;
  onSubmit: (input: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function TaskPrompt({ message, onSubmit, loading = false, error = null }: TaskPromptProps) {
  const [input, setInput] = useState('')

  const handleSubmit = async () => {
    if (!input.trim()) return
    await onSubmit(input)
    setInput('')
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Additional Information Needed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="text-muted-foreground">{message}</p>

        <div className="space-y-2">
          <Input
            placeholder="Enter your response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
