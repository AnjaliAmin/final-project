//program that performs essential MongoDB task operations

import clientPromise from "./mongodb";

const DB_NAME = "taskmanager";
const COLLECTION = "tasks";

// finds the collection
export const getCollection = async () => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return db.collection(COLLECTION);
};

// fetches all tasks
export const getAllTasks = async () => {
    const col = await getCollection();
    return col.find({ isDeleted: { $ne: true } }).toArray();
};

// sorts tasks by date
export const getTasksByDate = async (date: string) => {
    const col = await getCollection();

    return col.find({
        deadline: date,
        isDeleted: { $ne: true }
    }).toArray();
};

// creates tasks
export const createTask = async (task: {
    title: string;
    description: string;
    category: string;
    deadline: string;
}) => {
    const col = await getCollection();

    return col.insertOne({
        ...task,
        completed: false,
        isDeleted: false,
        createdAt: new Date()
    });
};

// updates tasks
export const updateTask = async (_id: string, updates: any) => {
    const col = await getCollection();
    const { ObjectId } = await import("mongodb");

    return col.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updates }
    );
};

// deletes tasks
export const deleteTask = async (_id: string) => {
    const col = await getCollection();
    const { ObjectId } = await import("mongodb");

    return col.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { isDeleted: true } }
    );
};