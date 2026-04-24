"use client";

import { useState } from "react";

export default function TaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                category,
                deadline
            })
        });

        setTitle("");
        setDescription("");
        setCategory("");
        setDeadline("");

        window.location.reload(); // simple refresh (we can improve later)
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
            <h2>Create Task</h2>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                placeholder="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />

            <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />

            <button type="submit">Add Task</button>
        </form>
    );
}