import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import type { Playbook } from '../types/playbook';

export function TaskInput() {
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedPlaybook, setSelectedPlaybook] = useState('');
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);

  useEffect(() => {
    const fetchPlaybooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/playbooks`);
        if (response.ok) {
          const data = await response.json();
          setPlaybooks(data);
        }
      } catch (error) {
        console.error('Failed to fetch playbooks:', error);
      }
    };

    fetchPlaybooks();
  }, []);

  const handleSubmit = async () => {
    // TODO: Implement task submission
    console.log('Task:', { taskDescription, selectedPlaybook });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Task Description</label>
          <Textarea
            placeholder="Describe your task in natural language..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="min-h-32"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Playbook (Optional)</label>
          <Select value={selectedPlaybook} onValueChange={setSelectedPlaybook}>
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

        <Button onClick={handleSubmit} className="w-full">
          Create Task
        </Button>
      </CardContent>
    </Card>
  );
}
