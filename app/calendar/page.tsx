"use client";
import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import Nav from "../../components/Nav";
import { TaskProps } from "@/types";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const Wrapper = styled.div`
    font-family: "Arial, Helvetica, sans-serif";
`;

const PageHeader = styled.h1`
    text-align: center;
`;

const Controls = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem;
`;

const NavButton = styled.button`
    cursor: pointer;
`;

const MonthTitle = styled.span`
    font-weight: bold;
    min-width: 220px;
    text-align: center;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    padding: 0 2% 2%;
`;

const DayHeader = styled.div`
    text-align: center;
    font-weight: bold;
    padding: 6px 0;
    border: 1px solid black;
`;

const DayCell = styled.div<{ $isToday: boolean; $isSelected: boolean }>`
    min-height: 90px;
    border: 1px solid black;
    padding: 4px;
    background: ${({ $isSelected }) => ($isSelected ? "#ddd" : "white")};
    font-weight: ${({ $isToday }) => ($isToday ? "bold" : "normal")};
    cursor: pointer;
    overflow: hidden;
`;

const EmptyCell = styled.div`
    min-height: 90px;
    border: 1px solid #ccc;
    background: #f5f5f5;
`;

const DayNumber = styled.span<{ $isToday: boolean }>`
    display: inline-block;
    color: black;
    text-decoration: ${({ $isToday }) => ($isToday ? "underline" : "none")};
    margin-bottom: 2px;
`;

const TaskChip = styled.div<{ $completed: boolean }>`
    font-size: 0.75rem;
    border: 1px solid black;
    padding: 1px 4px;
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: ${({ $completed }) => ($completed ? "line-through" : "none")};
    color: ${({ $completed }) => ($completed ? "#888" : "black")};
`;

const MoreTasks = styled.div`
    font-size: 0.7rem;
    font-style: italic;
`;

const DayDetail = styled.div`
    margin: 0 2% 2%;
    border: 1px solid black;
    padding: 1rem 1.5rem;
`;

const DayDetailHeader = styled.h2`
    border-bottom: 1px solid black;
    margin: 0 0 0.75rem;
    padding-bottom: 0.5rem;
`;

const TaskDetailItem = styled.div<{ $completed: boolean }>`
    border-bottom: 1px solid #ccc;
    padding: 0.5rem 0;
    opacity: ${({ $completed }) => ($completed ? 0.5 : 1)};

    strong {
        text-decoration: ${({ $completed }) => ($completed ? "line-through" : "none")};
    }

    p {
        margin: 4px 0 0;
    }
`;

export default function CalendarPage() {
    const [tasks, setTasks] = useState<TaskProps[]>([]);
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/tasks")
            .then((r) => r.json())
            .then(setTasks);
    }, []);

    const tasksByDate = useMemo(() => {
        const map: Record<string, TaskProps[]> = {};
        for (const task of tasks) {
            const d = new Date(task.deadline);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            if (!map[key]) map[key] = [];
            map[key].push(task);
        }
        return map;
    }, [tasks]);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const isCurrentMonth =
        today.getFullYear() === year && today.getMonth() === month;

    const prevMonth = () => {
        setSelectedDay(null);
        if (month === 0) { setMonth(11); setYear((y) => y - 1); }
        else setMonth((m) => m - 1);
    };

    const nextMonth = () => {
        setSelectedDay(null);
        if (month === 11) { setMonth(0); setYear((y) => y + 1); }
        else setMonth((m) => m + 1);
    };

    const cells: (number | null)[] = [
        ...Array(firstDayOfMonth).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const selectedTasks =
        selectedDay !== null
            ? tasksByDate[`${year}-${month}-${selectedDay}`] ?? []
            : [];

    return (
        <Wrapper>
            <Nav />
            <PageHeader>Calendar</PageHeader>
            <Controls>
                <NavButton onClick={prevMonth}>&#8592;</NavButton>
                <MonthTitle>{MONTH_NAMES[month]} {year}</MonthTitle>
                <NavButton onClick={nextMonth}>&#8594;</NavButton>
            </Controls>
            <Grid>
                {DAYS_OF_WEEK.map((d) => (
                    <DayHeader key={d}>{d}</DayHeader>
                ))}
                {cells.map((day, i) => {
                    if (day === null) return <EmptyCell key={`e-${i}`} />;
                    const key = `${year}-${month}-${day}`;
                    const dayTasks = tasksByDate[key] ?? [];
                    const isToday = isCurrentMonth && today.getDate() === day;
                    const isSelected = selectedDay === day;
                    return (
                        <DayCell
                            key={day}
                            $isToday={isToday}
                            $isSelected={isSelected}
                            onClick={() =>
                                setSelectedDay(day === selectedDay ? null : day)
                            }
                        >
                            <DayNumber $isToday={isToday}>{day}</DayNumber>
                            {dayTasks.slice(0, 3).map((t) => (
                                <TaskChip key={t._id} $completed={t.completed}>
                                    {t.title}
                                </TaskChip>
                            ))}
                            {dayTasks.length > 3 && (
                                <MoreTasks>+{dayTasks.length - 3} more</MoreTasks>
                            )}
                        </DayCell>
                    );
                })}
            </Grid>
            {selectedDay !== null && (
                <DayDetail>
                    <DayDetailHeader>
                        {MONTH_NAMES[month]} {selectedDay}, {year}
                    </DayDetailHeader>
                    {selectedTasks.length === 0 ? (
                        <p>No tasks for this day.</p>
                    ) : (
                        selectedTasks.map((t) => (
                            <TaskDetailItem key={t._id} $completed={t.completed}>
                                <strong>{t.title}</strong>
                                {t.category && <span> · {t.category}</span>}
                                {t.description && <p>{t.description}</p>}
                            </TaskDetailItem>
                        ))
                    )}
                </DayDetail>
            )}
        </Wrapper>
    );
}
