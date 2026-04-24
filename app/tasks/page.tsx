"use client";

import { useEffect, useState, useMemo } from "react";
import TaskPreview from "@/components/TaskPreview";
import { TaskProps } from "@/types";

export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [category, setCategory] = useState<string>("All");

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await fetch("/api/tasks");
            const data = await res.json();
            setTasks(data);
        };

        fetchTasks();
    }, []);

    const categories = ["All", ...new Set(tasks.map(t => t.category))];

    const filteredTasks = useMemo(() => {
        let updated = [...tasks];

        if (category !== "All") {
            updated = updated.filter(task => task.category === category);
        }

        updated.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            return new Date(a.deadline).getTime() -
                new Date(b.deadline).getTime();
        });

        return updated;
    }, [tasks, category]);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>All Tasks</h1>

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                {categories.map((cat, i) => (
                    <option key={i} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            {filteredTasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                filteredTasks.map(task => (
                    <TaskPreview key={task._id} task={task} />
                ))
            )}
        </div>
    );
}