import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { TaskInput } from './components/TaskInput'
import { PlaybookList } from './components/PlaybookList'
import { PlaybookEditor } from './components/PlaybookEditor'
import { createPlaybook } from './lib/api'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TaskInput />} />
            <Route path="/playbooks" element={<PlaybookList />} />
            <Route 
              path="/playbooks/new" 
              element={<PlaybookEditor onSubmit={createPlaybook} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
