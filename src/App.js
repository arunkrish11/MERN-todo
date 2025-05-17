import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setText('');
  };

  // Toggle completed
  const toggleTodo = async (id) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'PATCH' });
    const updatedTodo = await res.json();
    setTodos(todos.map(t => (t._id === id ? updatedTodo : t)));
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>To-Do List</h1>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add new todo"
        onKeyDown={e => e.key === 'Enter' && addTodo()}
        style={{ width: '100%', padding: 8, fontSize: 16 }}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ margin: '10px 0' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo._id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                marginLeft: 10,
                cursor: 'pointer'
              }}
              onClick={() => toggleTodo(todo._id)}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              style={{ float: 'right', cursor: 'pointer' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
