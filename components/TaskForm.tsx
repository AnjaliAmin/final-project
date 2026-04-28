"use client";

import { useState } from "react";

export default function TaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("FORM SUBMITTED");

        if (!title.trim() || !deadline) {
            alert("Title and deadline are required");
            return;
        }

        console.log({
            title,
            description,
            category,
            deadline,
        });

        const res = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title.trim(),
                description: description.trim(),
                category: category.trim(),
                deadline,
                completed: false
            })
        });

        if (!res.ok) {
            alert("Failed to create task");
            return;
        }

        setTitle("");
        setDescription("");
        setCategory("");
        setDeadline("");

        window.location.reload();
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
            <h2>Create Task</h2>

            <input
                placeholder="Title (required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                placeholder="Category (e.g. school, work)"
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
