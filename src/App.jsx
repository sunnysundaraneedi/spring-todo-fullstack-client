import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getAllTodos();
  }, []);

  const getAllTodos = async () => {
    try {
      const response = await fetch("http://localhost:8080/todos/all-todos");
      const data = await response.json();
      console.log(data);
      setTodos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const changeTodoStatus = async (id) => {
    console.log(id);
    const updateObj = todos.find((t) => t.id == id);
    updateObj["status"] = !updateObj["status"];
    delete updateObj.id;
    console.log(updateObj);
    try {
      const response = await fetch("http://localhost:8080/todos/update/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateObj),
      });
      console.log(response);
      if (response.status == 201) {
        setTodoInput("");
        getAllTodos();
      }
    } catch (error) {
      console.log(error);
    }

    // setTodos((prev) => {
    //   return prev.map((item) => {
    //     if (item.id == id) {
    //       item.status = !item.status;
    //     }
    //     count++;
    //     console.log(item, count);
    //     return item;
    //   });
    // });
  };
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:8080/todos/delete-todo/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (response.status == 204) {
        setTodoInput("");
        getAllTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addTodo = async () => {
    const body = {
      todo: todoInput,
      status: false,
    };
    try {
      const response = await fetch("http://localhost:8080/todos/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log(response);
      if (response.status == 201) {
        setTodoInput("");
        getAllTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h3>Your todo's</h3>
      <input
        type="text"
        value={todoInput}
        onChange={(e) => setTodoInput(e.target.value)}
      />
      <button onClick={addTodo}> + Add </button>
      {todos &&
        todos.map((todo) => (
          <div key={todo.id} style={{ display: "flex" }}>
            <p>{todo.todo}</p>
            <input
              type="checkbox"
              checked={todo.status}
              onChange={() => changeTodoStatus(todo.id)}
            />
            <button onClick={() => deleteTodo(todo.id)}>delete</button>
          </div>
        ))}
    </div>
  );
}

export default App;
