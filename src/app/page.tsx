'use client'

import ToDoListComponent from "@/components/ToDoListComponent";

export default function Home() {
  return (
    <div className="container mx-auto h-dvh border-2 border-sky-500">
      <header>
        <h1 className="p-3 text-white bg-sky-500 text-3xl">to do list</h1>
      </header>
      <main className="">
        <ToDoListComponent />
      </main>
    </div>
  );
}
