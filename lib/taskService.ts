import clientPromise from "./mongodb";

const DB_NAME = "taskmanager";
const COLLECTION = "tasks";

export const getCollection = async () => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return db.collection(COLLECTION);
};

export const getAllTasks = async () => {
    const col = await getCollection();
    return col.find({ isDeleted: { $ne: true } }).toArray();
};

export const getTasksByDate = async (date: Date) => {
    const col = await getCollection();

    const start = new Date(date);
    start.setHours(0,0,0,0);

    const end = new Date(date);
    end.setHours(23,59,59,999);

    return col.find({
        deadline: { $gte: start, $lte: end },
        isDeleted: { $ne: true }
    }).toArray();
};

export const createTask = async (task: any) => {
    const col = await getCollection();
    return col.insertOne({
        ...task,
        completed: false,
        isDeleted: false,
        createdAt: new Date()
    });
};

export const updateTask = async (_id: string, updates: any) => {
    const col = await getCollection();
    const { ObjectId } = await import("mongodb");

    return col.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updates }
    );
};

export const deleteTask = async (_id: string) => {
    const col = await getCollection();
    const { ObjectId } = await import("mongodb");

    return col.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { isDeleted: true } }
    );
};