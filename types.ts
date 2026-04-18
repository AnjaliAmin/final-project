export type TaskProps = {
    title: string;
    category: string;
    completed: boolean;
    description: string;
    deadline: Date;
    delete: boolean;
}