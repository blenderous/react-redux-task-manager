import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { addTodo, removeTodo, setTodoStatus } from "./redux/todoSlice";
import "./App.css";
import clsx from "clsx";
import { Todo } from "./models/Todo";
import { fetchTodos } from "./redux/actions";

function App() {
  const [todoText, setTodoText] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const todoList = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTodo = () => {
    if (todoText.trim().length < 5) {
      setError("Todo description should be at least 5 characters");
    } else if (todoText.trim().length > 50) {
      setError("Maximum allowed task length is 50");
    } else {
      dispatch(addTodo(todoText));
      setTodoText("");
      setError("");
    }
  };

  const handleTodoTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.trim().length >= 5 && inputText.trim().length <= 50) {
      setError("");
    }
    setTodoText(inputText);
  };

  const filterTodos = (todo: Todo) => {
    if (filter === "all") {
      return todo;
    } else if (filter === "completed") {
      return todo.completed;
    } else if (filter === "pending") {
      return !todo.completed;
    } else {
      return todo;
    }
  };

  const todoListFiltered = todoList.filter((todo) => filterTodos(todo));

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <>
      <h1 className="mb-3">Task Manager</h1>
      <section className="bg-stone-300 dark:bg-stone-700 p-3">
        <input
          className="w-full mb-2 sm:w-auto sm:mb-0 h-10 p-2 rounded-md"
          type="text"
          value={todoText}
          onChange={handleTodoTextChange}
        />
        <button className="sm:ml-4" onClick={handleAddTodo}>
          Add Task
        </button>
        {error && <p className="mt-1">{error}</p>}
      </section>
      <ul className="list-none max-h-screen overflow-y-auto">
        {todoListFiltered.length > 0 ? (
          todoListFiltered.map((todo: Todo) => (
            <li
              key={todo.id}
              className="bg-stone-200 dark:bg-stone-800 border-b border-b-stone-400 flex justify-between items-center p-3"
            >
              <p className={clsx("mr-6", { "line-through": todo.completed })}>
                {todo.title}
              </p>
              <p>
                <span className="mr-3">
                  <input
                    className="mr-2"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => {
                      dispatch(
                        setTodoStatus({
                          completed: !todo.completed,
                          id: todo.id,
                        })
                      );
                    }}
                  />
                  done
                </span>
                <button
                  onClick={() => {
                    dispatch(removeTodo(todo.id));
                  }}
                  role="button"
                >
                  Delete
                </button>
              </p>
            </li>
          ))
        ) : (
          <li className="bg-stone-200 dark:bg-stone-800 border-b border-b-stone-400 flex justify-between items-center p-6">
            <p>No tasks here</p>
          </li>
        )}
      </ul>
      <section className="bg-stone-300 dark:bg-stone-700 p-3">
        <p>
          <span className="inline-block w-full mb-2 sm:mb-0 sm:w-auto sm:mr-3">
            Show
          </span>
          <span>
            <button
              onClick={() => {
                setFilter("all");
              }}
              className={clsx("rounded-e-none", {
                "bg-stone-200 dark:bg-stone-600": filter === "all",
              })}
              role="button"
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter("completed");
              }}
              className={clsx("rounded-none", {
                "bg-stone-200 dark:bg-stone-600": filter === "completed",
              })}
              role="button"
            >
              Completed
            </button>
            <button
              onClick={() => {
                setFilter("pending");
              }}
              className={clsx("rounded-s-none", {
                "bg-stone-200 dark:bg-stone-600": filter === "pending",
              })}
              role="button"
            >
              Pending
            </button>
          </span>
        </p>
      </section>
    </>
  );
}

export default App;
