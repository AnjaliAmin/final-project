// program to display tasks page
/* displays all tasks as a list, sorted by earliest date,
with completed tasks at bottom, and ability to filter tasks by category
*/
// Anjali's component

"use client";
import styled from "styled-components";
import Nav from "../../components/Nav";
import { useEffect, useState, useMemo } from "react";
import TaskPreview from "@/components/TaskPreview";
import { TaskProps } from "@/types";
import TaskForm from "@/components/TaskForm";

// styling
const StyledWrapper = styled.div`
    font-family: "Arial, Helvetica, sans-serif";
    background-color: azure;
    height: 100vh;
`;

const StyledHeader = styled.header`
    font-size: calc(20px + 1.5vw);
    text-align: center;
    padding-top: 1%;
    padding-bottom: 1%;
    color: darkblue;
`;

const StyledMain = styled.main`
    padding-inline: 5%;
    margin: 4%;
`;

const StyledDiv = styled.div`
    padding-top: 1%;
    font-size: calc(10px + 1.5vw);
    text-align: center;
    color: darkblue;
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    font-family: "Arial, Helvetica, sans-serif";
`;

const Modal = styled.div`
    background: white;
    border: 2px solid black;
    padding: 1.5rem 2rem;
    min-width: 300px;
    max-width: 480px;
    width: 90%;
    color: black;
    font-size: calc(10px + 1.5vw);
`;

const ModalButtons = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    font-size: calc(5px + 1.5vw);
    
    #Delete {
      background: darkblue;
      color: white;
      border: none;
      padding: 6px 14px;
      cursor: pointer;
      &:hover { background: lightblue; }
    }
`;

// function to create and display tasks page
export default function TasksPage() {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const [category, setCategory] = useState<string>("All");
    const [activeTask, setActiveTask] = useState<TaskProps | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

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
        <StyledWrapper>
            <Nav/>
            <StyledMain>
                <TaskForm/>
                <StyledHeader><strong>Tasks</strong></StyledHeader>
                <StyledDiv>
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
                </StyledDiv>

                {filteredTasks.length === 0 ? (
                    <p>No tasks found.</p>
                ) : (
                    filteredTasks.map(task => (
                        <TaskPreview
                            key={task._id}
                            task={task}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))
                )}
            </StyledMain>
            {confirmingDelete && activeTask && (
                <Overlay onClick={closeModal}>
                    <Modal onClick={(e) => e.stopPropagation()}>
                        <p>
                            Are you sure you want to delete{" "}
                            <strong>{activeTask.title}</strong>?
                        </p>

                        <ModalButtons>
                            <button onClick={closeModal}>Cancel</button>

                            <button id="Delete"
                                    onClick={() => handleDeleteTask(activeTask)}
                            >
                                Yes, Delete
                            </button>
                        </ModalButtons>
                    </Modal>
                </Overlay>
            )}
        </StyledWrapper>
    );
}
