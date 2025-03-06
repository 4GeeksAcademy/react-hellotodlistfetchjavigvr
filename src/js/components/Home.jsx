import React, { useState, useEffect } from 'react';

function Home() {
  // Guarda la lista de tareas 
  const [todos, setTodos] = useState([]);
  // Guarda el texto del input
  const [taskInput, setTaskInput] = useState('');


  const syncTodos = (newTodos) => {
    fetch('https://playground.4geeks.com/todo/users/javi_gvr', {
      method: "PUT",
      body: JSON.stringify(newTodos),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al sincronizar con el servidor");
        }
        return response.json();
      })
      .then(data => {
        console.log("Sincronización exitosa", data);
      })
      .catch(error => console.error("Error al sincronizar:", error));
  };

  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/users/javi_gvr')
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener las tareas");
        }
        return response.json();
      })
      .then(data => {
        console.log("Tareas obtenidas:", data);
        setTodos(data.todos);
      })
      .catch(error => console.error("Error al obtener las tareas:", error));
  }, []);


  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado, valor:", taskInput);
    if (taskInput.trim() === '') return;
    const newTask = { label: taskInput, done: false };

    fetch('https://playground.4geeks.com/todo/todos/javi_gvr', {
      method: "POST",
      body: JSON.stringify(newTask),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al agregar la tarea");
        }
        return response.json();
      })
      .then(data => {
        console.log("Tarea agregada:", data);
        setTodos ( [...todos, data]);
        setTaskInput('');
      })
      .catch(error => console.error("Error al agregar la tarea:", error));



  };


  const deleteTask = (taskId) => {
    const newTodos = todos.filter(task => task.id !== taskId);
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: "DELETE"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al eliminar la tarea");
        }
        return response.text();
      })
      .then(data => {
        console.log("Tarea eliminada:", data);
      })
      .catch(error => console.error("Error al eliminar la tarea:", error));
    setTodos(newTodos);
    
  };


  const clearAllTasks = () => {
    setTodos([]);
    syncTodos([]);
  };


  const tasksToRender = todos.map(task => (
    <li key={task.id}>
      <div className="view">
        <label>{task.label}</label>
        <button className="destroy" onClick={() => deleteTask(task.id)}></button>
      </div>
    </li>
  ));

  return (
    <section className="todoapp">
      <header className="header">
        <h1>ToDoList</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            autoFocus
            className="new-todo"
            placeholder="Que hay que hacer?"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
        </form>
      </header>
      <section className="main">
        <ul className="todo-list">
          {tasksToRender}
        </ul>
      </section>
      <footer className="footer">
        <span className="todo-count">
          <strong>{todos.filter(task => !task.done).length}</strong> por hacer
        </span>
        <button onClick={clearAllTasks}>Limpiar Todo</button>
      </footer>
    </section>
  );
}

export default Home;
