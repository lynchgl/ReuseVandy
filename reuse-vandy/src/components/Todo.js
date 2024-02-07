import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, runTransaction, orderBy, query, onSnapshot } from 'firebase/firestore';
import EditTodo from './EditTodo';
import '../styles/styles.css';

// Import the correct db reference
import { dbTodos } from '../services/firebase.config';

import { Link } from 'react-router-dom';

const Todo = () => {
  const [createTodo, setCreateTodo] = useState('');
  const [todos, setTodos] = useState([]);

  // Use the correct db reference
  const collectionRef = collection(dbTodos, 'todos');

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(query(collectionRef, orderBy('timestamp')), (snapshot) => {
      const updatedTodos = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTodos(updatedTodos);
    });

    return () => {
      // Unsubscribe from real-time updates when the component unmounts
      unsubscribe();
    };
  }, [collectionRef]);

  const submitTodo = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collectionRef, {
        todo: createTodo,
        isChecked: false,
        timestamp: serverTimestamp(),
      });
      setCreateTodo(''); // Clear the input after submission
      // No need to reload the entire page; real-time updates will handle it
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this Task!')) {
        const documentRef = doc(dbTodos, 'todos', id);
        await deleteDoc(documentRef);
        // No need to reload the entire page; real-time updates will handle it
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const checkHandler = async (event, todo) => {
    try {
      const docRef = doc(dbTodos, 'todos', event.target.name);
      const transactionResult = await runTransaction(dbTodos, async (transaction) => {
        const todoDoc = await transaction.get(docRef);
        if (!todoDoc.exists()) {
          throw new Error('Document does not exist!');
        }
        const newValue = !todoDoc.data().isChecked;
        transaction.update(docRef, { isChecked: newValue });
        return newValue;
      });

      setTodos((state) => {
        const updatedTodos = state.map((checkBox) =>
          checkBox.id.toString() === event.target.name
            ? { ...checkBox, isChecked: transactionResult }
            : checkBox
        );
        return updatedTodos;
      });

      console.log('Transaction successfully committed!');
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };
  return (
    <>
    <div className='todo-container'>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-white">
              <div className="card-body">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#addModal"
                  type="button"
                  className="btn btn-warning">Add Product
                </button>


                {todos.map(({ todo, id, isChecked, timestamp }) =>
                  <div className="todo-list" key={id}>
                    <div className="todo-item">
                      <hr />
                      <span className={`${isChecked === true ? 'done' : ''}`}>
                        <div className="checker" >
                          <span className="" >
                            <input
                              type="checkbox"
                              defaultChecked={isChecked}
                              name={id}
                              onChange={(event) => checkHandler(event, todo)}
                            />
                          </span>
                        </div>
                        &nbsp;{todo}<br />
                        <i>{new Date(timestamp.seconds * 1000).toLocaleString()}</i>
                      </span>
                      <span className=" float-end mx-3">
                        <EditTodo todo={todo} id={id} />
                      </span>
                      <button
                        type="button"
                        className="btn btn-danger float-end"
                        onClick={() => deleteTodo(id)}
                      >Delete</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

           {/* Button to navigate to another page */}
           <div className="top-right-button">
        <Link to="/Marketplace">
          <button className="btn btn-primary">Go to Marketplace</button>
        </Link>
      </div>

      {/* Modal */}
      <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form className="d-flex" onSubmit={submitTodo}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">Add Product</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a Product"
                  onChange={(e) => setCreateTodo(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                <button className="btn btn-primary">Create New Listing</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  )
}

export default Todo