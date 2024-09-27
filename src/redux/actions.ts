import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTodos = createAsyncThunk("todos/fetch", async () => {
  const response = await axios.get("http://localhost:3000/todos");
  return response.data;
});

export const addTodo = createAsyncThunk("todos/add", async (newTodo) => {
  const response = await axios.post("http://localhost:3000/todos", newTodo);
  return response.data;
});
