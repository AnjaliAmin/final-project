import TaskPreview from "@/components/TaskPreview";
import { TaskProps } from "@/types";
import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import TaskForm from "@/components/TaskForm";

export default async function HomePage() {
  const client = await clientPromise;
  const db = client.db("taskmanager");

  const tasksRaw = await db
      .collection("tasks")
      .find({ isDeleted: { $ne: true } })
      .toArray();

  const tasks: TaskProps[] = tasksRaw.map((task) => ({
    _id: task._id.toString(),
    title: task.title,
    category: task.category,
    description: task.description,
    completed: task.completed,
    deadline: task.deadline,
    deleted: task.deleted
  }));

  const today = new Date();

  const todaysTasks = tasks.filter((task) => {
    const d = new Date(task.deadline);
    return d.toDateString() === today.toDateString();
  });

  todaysTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    return new Date(a.deadline).getTime() -
        new Date(b.deadline).getTime();
  });

  return (
      <div style={{ padding: "2rem" }}>

        {/* 🧭 NAVIGATION */}
        <nav style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          padding: "1rem",
          background: "#eee",
          borderRadius: "8px"
        }}>
          <Link href="/">Home</Link>
          <Link href="/tasks">Tasks</Link>
          <Link href="/calendar">Calendar</Link>
        </nav>

        <TaskForm />
        <h1>Today’s Tasks</h1>

        {todaysTasks.length === 0 ? (
            <p>No tasks for today.</p>
        ) : (
            todaysTasks.map((task) => (
                <TaskPreview key={task._id} task={task} />
            ))
        )}
      </div>
  );
}