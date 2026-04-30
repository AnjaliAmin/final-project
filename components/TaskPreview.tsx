"use client";

import { TaskProps } from "@/types";
import styled from "styled-components";

const StyledMain = styled.div<{ $completed: boolean }>`
    display: flex;
    flex-direction: column;
    border: 3px solid darkblue;
    border-radius: 5px;
    font-family: "Arial, Helvetica, sans-serif";
    background-color: white;
    margin: 5%;
    opacity: ${({ $completed }) => ($completed ? 0.5 : 1)};
    text-decoration: ${({ $completed }) => ($completed ? "line-through" : "none")};
`;

const StyledHead = styled.div`
    display: flex;
    flex-direction: row;
    border-bottom: 2px solid darkblue;
    justify-content: space-between;
    padding-left: 5%;
    padding-right: 10%;
    background-color: lavender;
    color: darkblue;
    
    #TaskTitle {
        font-size: calc(15px + 1.2vw);
        text-align: center;
        padding-block: 2%;
    }

    #Checkbox {
        margin: 10px;
        transform: scale(1.3);
        accent-color: darkblue;
    }
`;

const StyledInfo = styled.div`
    display: flex;
    flex-direction: column;
    border-bottom: 2px solid darkblue;
    padding-left: 5%;
    padding-block: 2%;
    
    #TaskCategory {
        font-size: calc(8px + 1.2vw);
        padding: 1%;
    }

    #TaskDescription {
        font-size: calc(10px + 1.2vw);
        padding: 1%;
    }

    #TaskDueDate {
        font-size: calc(8px + 1.2vw);
        padding: 1%;
    }
`;

const StyledButtons = styled.div`
    display: flex;
    flex-direction: row;
    cursor: pointer;
    justify-content: space-between;
    padding-inline: 5%;
    padding-block: 2%;
    background-color: lavender;

    button {
        cursor: pointer;
        padding: 1%;
        padding-inline: 5%;
        border-radius: 10px;
        border: 2px solid darkblue;
        display: flex;
        justify-content: center;
        color: darkblue;
        background-color: white;
    }
`;

type Props = {
    task: TaskProps;
    onDeleteClick: (task: TaskProps) => void;
}

export default function TaskPreview({ task, onDeleteClick }: Props) {

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

    const editTask = async () => {
        const newTitle = prompt("Edit title:", task.title);
        if (!newTitle) return;

        const newDescription = prompt("Edit description:", task.description);
        if (!newDescription) return;

        const newDeadline = prompt("Edit deadline:", task.deadline);
        if (!newDeadline) return;

        const newCategory = prompt("Edit category:", task.category);
        if (!newCategory) return;

        await fetch(`/api/tasks/${task._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...task,
                title: newTitle,
                description: newDescription,
                deadline: newDeadline,
                category: newCategory,
            }),
        });

        window.location.reload();
    };

    return (
        <StyledMain $completed={task.completed}>
            <StyledHead>
                <h2 id="TaskTitle"><strong> {task.title} </strong></h2>

                <input
                    id="Checkbox"
                    type="checkbox"
                    checked={task.completed}
                    onChange={toggleComplete}
                />
            </StyledHead>
            <StyledInfo>
                <h4 id="TaskCategory">{task.category}</h4>
                <h5 id="TaskDescription">{task.description}</h5>
                <h4 id="TaskDueDate"> {task.deadline}</h4>
            </StyledInfo>

            <StyledButtons>
                <button onClick={editTask}>Edit</button>
                <button onClick={() => onDeleteClick(task)}> Delete </button>
            </StyledButtons>
        </StyledMain>
    );
} 
