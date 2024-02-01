import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase.config';


const EditTodo = ({ todo, id }) => {
  const [todos, setTodos] = useState([todo]);

  // Subscribe to real-time updates
  useEffect(() => {
    const todoDocument = doc(db, 'todo', id);
    const unsubscribe = onSnapshot(todoDocument, (snapshot) => {
      const updatedTodo = { ...snapshot.data(), id: snapshot.id };
      setTodos(updatedTodo.todo);
    });

    return () => {
      // Unsubscribe from real-time updates when the component unmounts
      unsubscribe();
    };
  }, [id]);

  const updateTodo = async (e) => {
    e.preventDefault();
    try {
      const todoDocument = doc(db, 'todo', id);
      await updateDoc(todoDocument, {
        todo: todos,
      });
      // No need to reload the entire page; real-time updates will handle it
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        data-bs-toggle="modal"
        data-bs-target={`#id${id}`}      >
        Edit Product
      </button>

      <div
        className="modal fade"
        id={`id${id}`}
        tabIndex="-1"
        aria-labelledby="editLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editLabel">Update Todo Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <form className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  defaultValue={todo}
                  onChange={e => setTodos(e.target.value)}
                />
              </form>

            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={e => updateTodo(e)}
              >Update Todo</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditTodo