"use client";

import styled from "styled-components";
import { useState } from "react";

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 3px solid darkblue;
    border-radius: 5px;
    text-align: center;
    padding-bottom: 2%;
    background-color: white;
    margin-block: 5%;
    margin-inline: 5%;
    
    #Header {
        font-size: calc(12px + 1.5vw);
        color: darkblue;
        margin-bottom: 2%;
        padding-bottom: 2%;
        padding-top: 2%;
        border-bottom: 2px solid darkblue;
        background-color: lavender;
    }
`;
const StyledInputs = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: stretch;
    text-align: center;
    align-items: center;
    color: darkblue;
    margin: 3%;
    padding: 2%;
`;

const StyledButton = styled.button`
    border: 2px solid darkblue;
    border-radius: 5px;
    padding: 1%;
    color: darkblue;
    background-color: lavender;
`;

type TaskFormProps = {
    onTaskCreated?: () => void;
};

export default function TaskForm({onTaskCreated}: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
                deadline: deadline,
                completed: false
            }),
        });

        if (!res.ok) {
            alert("Failed to create task");
            return;
        }

        setTitle("");
        setDescription("");
        setCategory("");
        setDeadline("");

        onTaskCreated?.();
        window.location.reload();
    };

    return (
        <StyledWrapper>
            <form onSubmit={handleSubmit}>
                <h2 id="Header"><strong> Create Task </strong></h2>
                <StyledInputs>
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
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
                </StyledInputs>
                <StyledButton type="submit">Add Task</StyledButton>
            </form>
        </StyledWrapper>
    );
}
