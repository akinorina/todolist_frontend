import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";

export class ToDo {
  id: number = 0;
  todo: string = '';

  constructor(id: number, todo: string) {
    this.id = id;
    this.todo = todo;
  }
}

export default function ToDoListComponent() {
  // ToDoデータ
  const [todolist, setTodolist] = useState<ToDo[]>([])

  useEffect(() => {
    // 元データ(仮)
    setTodolist([
      { id: 1, todo: '楽しいお祭り' },
      { id: 2, todo: '嬉しい会話' },
      { id: 3, todo: '愛あるふれあい' },
    ]);
  }, []);

  // todo追加
  function handleAdd(todo: string): void {
    let newId = 0;
    todolist.forEach((item) => {
      if (item.id > newId) {
        newId = item.id;
      }
    })
    setTodolist([...todolist, new ToDo(++newId, todo)]);
  }

  // todo 編集
  function handleEdit(id: number, todo: string): void {
    //
    const newToDoList = todolist.map((todoItem) => {
      if (todoItem.id === id) {
        return new ToDo(id, todo);
      } else {
        return todoItem;
      }
    });
    setTodolist(newToDoList);
  }

  // todo 削除
  function handleRemove(id: number) {
    //
    const newToDoList: ToDo[] = [];
    todolist.forEach((item: ToDo) => {
      if (item.id !== id) {
        newToDoList.push(item);
      }
    })
    setTodolist(newToDoList);
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
