import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("taskmanager");

    await db.collection("tasks").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("taskmanager");

    const { _id, ...update } = body;

    await db.collection("tasks").updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    );

    return NextResponse.json({ success: true });
}
