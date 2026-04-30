// Format for task items

export type TaskProps = {
    _id: string;
    title: string;
    category: string;
    completed: boolean;
    description: string;
    deadline: string;
    deleted: boolean;
}