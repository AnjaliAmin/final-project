"use client";
import styled from "styled-components";
import Nav from "../../components/Nav";

const StyledWrapper = styled.div`
    font-family: "Arial, Helvetica, sans-serif";
`;

const StyledHeader = styled.header`
    font-size: calc(20px + 1.5vw);
    text-align: center;
    padding-top: 1%;
`;

const StyledMain = styled.main`
    padding: 2%;
    padding-top: 0;
`;
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
        <StyledWrapper>
            <Nav/>
            <StyledHeader>Tasks</StyledHeader>
            <StyledMain>
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
            </StyledMain>
        </StyledWrapper>
    );
}