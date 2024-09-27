import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, TodoState } from "../models/Todo";
import { v4 as uuidv4 } from "uuid";
import { fetchTodos } from "./actions";

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer: (state: TodoState, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      },
      prepare: (title: string) => ({
        payload: {
          id: uuidv4(),
          title,
          completed: false,
        } as Todo,
      }),
    },
    removeTodo(state: TodoState, action: PayloadAction<string>) {
      const index = state.todos.findIndex((todo) => todo.id === action.payload);
      state.todos.splice(index, 1);
    },
    setTodoStatus(
      state: TodoState,
      action: PayloadAction<{ completed: boolean; id: string }>
    ) {
      const index = state.todos.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.todos[index].completed = action.payload.completed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state: TodoState, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  },
});

export const { addTodo, removeTodo, setTodoStatus } = todoSlice.actions;
export default todoSlice.reducer;
