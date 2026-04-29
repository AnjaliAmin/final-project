"use client";

import {useEffect, useState, useMemo} from "react";
import TaskPreview from "@/components/TaskPreview";
import { TaskProps } from "@/types";
import TaskForm from "@/components/TaskForm";
import Nav from "../components/Nav";

export default function HomePage() {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [activeTask, setActiveTask] = useState<TaskProps | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const handleDeleteTask = async (task: TaskProps) => {
    await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });

    setTasks((prev) => prev.filter((t) => t._id !== task._id));
    setActiveTask(null);
    setConfirmingDelete(false);
  };

  const handleDeleteClick = (task: TaskProps) => {
    setActiveTask(task);
    setConfirmingDelete(true);
  };

  const closeModal = () => {
    setActiveTask(null);
    setConfirmingDelete(false);
  };

  const todaysTasks = useMemo(() => {
    const today = new Date();

    return tasks
        .filter((task) => {
          const d = new Date(task.deadline);
          return d.toDateString() === today.toDateString();
        })
        .sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }

          return (
              new Date(a.deadline).getTime() -
              new Date(b.deadline).getTime()
          );
        });
  }, [tasks]);

  return (
      <div>
        <Nav/>
          <TaskForm />
          <h1>Today’s Tasks</h1>

          {todaysTasks.length === 0 ? (
              <p>No tasks for today.</p>
          ) : (
              todaysTasks.map((task) => (
                  <TaskPreview
                      key={task._id}
                      task={task}
                      onDeleteClick={handleDeleteClick}
                  />
              ))
          )}
        {confirmingDelete && activeTask && (
            <div>
              <div>
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{activeTask.title}</strong>?
                </p>

                <button
                    onClick={() => activeTask && handleDeleteTask(activeTask)}
                    style={{ marginRight: "10px" }}
                >
                  Yes, Delete
                </button>

                <button onClick={closeModal}>Cancel</button>
              </div>
            </div>
        )}
      </div>
  );
}
