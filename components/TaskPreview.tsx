"use client";

import { TaskProps } from "@/types";
import styled from "styled-components";

const StyledMain = styled.div<{ $completed: boolean }>`
    background-color: lavender;
    display: flex;
    flex-direction: column;
    border: 3px solid darkblue;
    margin: 5px;
    padding-top: 1%;
    padding-bottom: 1%;
    opacity: ${({ $completed }) => ($completed ? 0.5 : 1)};

    #TaskTitle {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(10px + 1.2vw);
        border-bottom: 2px solid darkblue;
        text-align: center;
        text-decoration: ${({ $completed }) => ($completed ? "line-through" : "none")};
    }

    #TaskCategory {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(8px + 1.2vw);
        border-bottom: 1px solid darkblue;
        padding: 1%;
    }

    #TaskDescription {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(6px + 1.5vw);
        border-bottom: 1px solid darkblue;
        padding: 1%;
    }

    #TaskDueDate {
        font-family: "Arial, Helvetica, sans-serif";
        font-size: calc(8px + 1.2vw);
        padding: 1%;
    }

    #Checkbox {
        margin: 10px;
        transform: scale(1.3);
    }

    #Buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
        padding: 10px;
    }

    button {
        cursor: pointer;
        padding: 5px 10px;
    }
`;

export default function TaskPreview({ task }: { task: TaskProps }) {

    const toggleComplete = async () => {
        await fetch(`/api/tasks/${task._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...task,
                completed: !task.completed,
            }),
        });

        window.location.reload();
    };

    const deleteTask = async () => {
        console.log("DELETE CLICKED", task._id);

        const res = await fetch(`/api/tasks/${task._id}`, {
            method: "DELETE",
        });

        console.log("DELETE RESPONSE:", res.status);

        window.location.reload();
    };

    const editTask = async () => {
        const newTitle = prompt("Edit title:", task.title);
        if (!newTitle) return;

        await fetch(`/api/tasks/${task._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...task,
                title: newTitle,
            }),
        });

        window.location.reload();
    };

    return (
        <StyledMain $completed={task.completed}>
            <input
                id="Checkbox"
                type="checkbox"
                checked={task.completed}
                onChange={toggleComplete}
            />

            <h2 id="TaskTitle">{task.title}</h2>
            <h4 id="TaskCategory">{task.category}</h4>
            <h5 id="TaskDescription">{task.description}</h5>
            <h4 id="TaskDueDate">
                {new Date(task.deadline).toLocaleDateString()}
            </h4>

            {/* ✅ NEW BUTTONS */}
            <div id="Buttons">
                <button onClick={editTask}>Edit</button>
                <button onClick={deleteTask}>Delete</button>
            </div>
        </StyledMain>
    );
} 
