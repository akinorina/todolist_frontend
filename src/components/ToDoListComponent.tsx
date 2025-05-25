'use client'

import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import createClient from 'openapi-fetch';
import type { paths } from '@/lib/api/schema';

export class ToDo {
  id: number = 0;
  todo: string = '';

  constructor(id: number, todo: string) {
    this.id = id;
    this.todo = todo;
  }
}

// openapi-fetch
const client = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

export default function ToDoListComponent() {

  // ToDoデータ
  const [todolist, setTodolist] = useState<ToDo[]>([])

  useEffect(() => {
    // データ取得・設定
    client.GET('/api/todos', {})
      .then((res) => {
        setTodolist(res.data as ToDo[]);
      })
  }, []);

  // todo追加
  function handleAdd(todo: string): void {
    const newTodo = new ToDo(0, todo);

    // [API]: 追加
    client.POST("/api/todos", {
      body: newTodo,
    }).then((res) => {
      if (res.data) {
        const newTodo = new ToDo(res.data.id, res.data.todo);
        setTodolist([...todolist, newTodo]);
      }
    });
  }

  // todo 編集
  function handleEdit(id: number, todo: string): void {
    //
    const newTodo = new ToDo(id, todo);

    // [API]: 更新
    client.PATCH('/api/todos/{id}', {
      params: {
        path: {
          id: id.toString(),
        },
      },
      body: newTodo,
    }).then((res) => {
      if (res.data) {
        const newToDoList = todolist.map((todoItem) => {
          if (todoItem.id === id) {
            return new ToDo(res.data.id, res.data.todo);
          } else {
            return todoItem;
          }
        });
        setTodolist(newToDoList);
      }
    })
  }

  // todo 削除
  function handleRemove(id: number) {
    // [API]: 更新
    client.DELETE('/api/todos/{id}', {
      params: {
        path: {
          id: id.toString(),
        },
      },
    }).then((res) => {
      if (res.data) {
        const newToDoList = todolist.filter((item) => item.id !== id);
        setTodolist(newToDoList);
      }
    })
  }

  return (
    <div className="">
      <AddTodoItem addItem={handleAdd} />

      <ToDoList
        todolist={todolist}
        editTodo={handleEdit}
        removeTodo={handleRemove}
      />
    </div>
  );
}

function ToDoList({
  todolist,
  editTodo,
  removeTodo
}: {
  todolist: ToDo[],
  editTodo: (id: number, todo: string) => void,
  removeTodo: (id: number) => void
}) {
  return (
    <div className="">
      <ul className="mt-5">
        {todolist.map((toDoItem) => {
          return (
            <TodoItem
              toDoItem={toDoItem}
              editTodo={editTodo}
              removeTodo={removeTodo}
              key={toDoItem.id}
            />
          );
        })}
      </ul>
    </div>
  );
}

function TodoItem({
  toDoItem,
  editTodo,
  removeTodo
}: {
  toDoItem: ToDo,
  editTodo: (id: number, todo: string) => void,
  removeTodo: (id: number) => void
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [editText, setEditText] = useState('');

  let editPart;
  if (isEdit) {
    editPart = (
      <>
        <TextField
          sx={{ width: '70%' }}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
        />

        <Button
          variant="outlined"
          sx={{ marginLeft: '10px' }}
          onClick={() => {
            editTodo(toDoItem.id, editText);
            setIsEdit(!isEdit);
          }}
        >更新</Button>
      </>
    );
  } else {
    editPart = (
      <>
        {toDoItem.id}: {toDoItem.todo}

        <Button
          variant="outlined"
          sx={{ marginLeft: '10px' }}
          onClick={() => {
            setEditText(toDoItem.todo);
            setIsEdit(!isEdit);
          }}
        >編集</Button>
      </>
    );
  }
  return (
    <li className="p-5 border border-sky-200">
      {editPart}

      <Button
        variant="outlined"
        sx={{ marginLeft: '10px' }}
        onClick={() => removeTodo(toDoItem.id)}
      >削除</Button>
    </li>
  );
}

function AddTodoItem({
  addItem
}: {
  addItem: (todo: string) => void
}) {
  const [newTodo, setNewTodo] = useState('');

  return (
    <div className="">
      <TextField
        sx={{ width: '70%' }}
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{ padding: '15px', marginLeft: '10px' }}
        onClick={() => {
          addItem(newTodo);
          setNewTodo('');
        }}
      >追加</Button>
    </div>
  );
}
