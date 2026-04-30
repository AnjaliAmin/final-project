// program to display home page
// displays all of today's tasks, completed or active
// Sarah's component

"use client";

import {useEffect, useState, useMemo} from "react";
import TaskPreview from "@/components/TaskPreview";
import { TaskProps } from "@/types";
import TaskForm from "@/components/TaskForm";
import Nav from "../components/Nav";
import styled from "styled-components";

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

// function to create and display home page
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

  const todayString = new Date().toLocaleDateString("en-CA");

  const todaysTasks = useMemo(() => {

    return tasks
        .filter((task) => task.deadline === todayString)
        .sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
          }

          return a.deadline.localeCompare(b.deadline);
        });
  }, [tasks, todayString]);

  return (
      <StyledWrapper>
        <Nav/>
        <StyledMain>
          <TaskForm/>
          <StyledHeader><strong>Today’s Tasks</strong></StyledHeader>

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
        </StyledMain>
      </StyledWrapper>
  );
}
