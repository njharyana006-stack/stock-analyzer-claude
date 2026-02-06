
import React from 'react';
import PropTypes from 'prop-types';
import './TodoItem.css';

function TodoItem({ todo, toggleComplete, deleteTodo }) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo.id)}
      />
      <p>{todo.text}</p>
      <button onClick={() => deleteTodo(todo.id)}>x</button>
    </div>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  toggleComplete: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
};

export default TodoItem;
