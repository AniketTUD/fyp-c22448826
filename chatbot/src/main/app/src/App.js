import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card.html';
import { Button } from './components/ui/button.html';
import { Input } from './components/ui/input.html';
import { Textarea } from './components/ui/textarea.html';

// Full-stack style demo using browser localStorage as mock DB and API-ready structure
const defaultModules = [
  { id: 1, name: 'Web Development', tasks: ['Lab 1: HTML Basics', 'Assignment: Portfolio Site'] },
  { id: 2, name: 'Databases', tasks: ['Lab 2: SQL Queries', 'Assignment: ER Diagram'] },
  { id: 3, name: 'Software Engineering', tasks: ['Lab 3: UML', 'Assignment: Agile Plan'] }
];

async function askAI(moduleName, taskName, question) {
  // Replace with backend fetch('/api/chat') in production
  return `AI Assistant (${moduleName} / ${taskName}): To solve \"${question}\", review the brief, identify inputs/outputs, implement step-by-step, then test edge cases.`;
}

export default function App() {
  const [route, setRoute] = useState('login');
  const [email, setEmail] = useState('student@example.com');
  const [password, setPassword] = useState('password');
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const db = JSON.parse(localStorage.getItem('aas_db') || '{}');
    if (!db.users) {
      db.users = [{ email: 'student@example.com', password: 'password', name: 'Student User', modules: [1,2,3] }];
      db.modules = defaultModules;
      localStorage.setItem('aas_db', JSON.stringify(db));
    }
  }, []);

  const login = () => {
    const db = JSON.parse(localStorage.getItem('aas_db'));
    const found = db.users.find(u => u.email === email && u.password === password);
    if (!found) return alert('Invalid credentials');
    setUser(found);
    setModules(db.modules.filter(m => found.modules.includes(m.id)));
    setRoute('dashboard');
  };

  const logout = () => { setUser(null); setRoute('login'); setSelectedModule(null); setSelectedTask(null); setMessages([]); };

  const sendQuestion = async () => {
    if (!question || !selectedTask) return;
    const userMsg = { role: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const reply = await askAI(selectedModule.name, selectedTask, question);
    const botMsg = { role: 'assistant', text: reply };
    setMessages(prev => [...prev, botMsg]);
    setQuestion('');
    setLoading(false);
  };

  if (route === 'login') return <div className='p-8 max-w-md mx-auto'><Card><CardContent className='p-6 space-y-4'><h1 className='text-2xl font-bold'>Academic Support Platform</h1><Input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} /><Input type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} /><Button className='w-full' onClick={login}>Login</Button><p className='text-xs text-gray-500'>Demo: student@example.com / password</p></CardContent></Card></div>;

  return <div className='p-6 space-y-4'>
    <div className='flex justify-between items-center'><h1 className='text-2xl font-bold'>Welcome, {user.name}</h1><Button variant='outline' onClick={logout}>Logout</Button></div>
    <div className='grid md:grid-cols-3 gap-4'>
      <Card><CardContent className='p-4'><h2 className='font-semibold mb-3'>My Modules</h2>{modules.map(m => <Button key={m.id} variant='outline' className='w-full mb-2 justify-start' onClick={() => {setSelectedModule(m); setSelectedTask(null);}}>{m.name}</Button>)}</CardContent></Card>
      <Card><CardContent className='p-4'><h2 className='font-semibold mb-3'>Tasks & Assignments</h2>{selectedModule ? selectedModule.tasks.map(t => <Button key={t} variant='outline' className='w-full mb-2 justify-start' onClick={() => setSelectedTask(t)}>{t}</Button>) : <p className='text-sm text-gray-500'>Choose a module</p>}</CardContent></Card>
      <Card><CardContent className='p-4 space-y-3'><h2 className='font-semibold'>AI Chat {selectedTask ? `• ${selectedTask}` : ''}</h2><div className='border rounded-xl h-80 overflow-auto p-3 space-y-2 bg-gray-50'>{messages.map((m,i)=><div key={i} className='text-sm'><span className='font-semibold'>{m.role}:</span> {m.text}</div>)}{loading && <div className='text-sm'>assistant: Thinking...</div>}</div><Textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder='Ask about this task...' /><Button disabled={!selectedTask || loading} onClick={sendQuestion}>Send</Button></CardContent></Card>
    </div>
  </div>;
}

