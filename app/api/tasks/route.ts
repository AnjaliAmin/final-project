import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
    const client = await clientPromise;
    const db = client.db("taskmanager");

    const tasks = await db.collection("tasks").find().toArray();

    return NextResponse.json(tasks);
}

export async function POST(req: Request) {
    const body = await req.json();

    if (!body.title) {
        return NextResponse.json(
            { error: "Title is required" },
            { status: 400 }
        );
    }

    const client = await clientPromise;
    const db = client.db("taskmanager");

    const newTask = {
        title: body.title,
        description: body.description || "",
        category: body.category || "General",
        deadline: new Date(body.deadline),
        completed: false,
        delete: false
    };

    const result = await db.collection("tasks").insertOne(newTask);

    return NextResponse.json({
        ...newTask,
        _id: result.insertedId
    });
}