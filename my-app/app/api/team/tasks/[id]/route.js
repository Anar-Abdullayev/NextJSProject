import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req, { params }) {
    const { id } = await params;
    const tokenCookie = await cookies().get('token');
    if (!tokenCookie) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(tokenCookie.value);
    if (!payload?.teamId) {
        return NextResponse.json({ error: 'Requester is not in a team' }, { status: 400 });
    }

    const takenTask = await prisma.task.findUnique({
        where: { id: Number(id) }
    })

    if (!takenTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    if (takenTask.assigneeId) return NextResponse.json({ error: 'Task is already taken' }, { status: 400 });

    await prisma.task.update({
        where: { id: Number(takenTask.id) },
        data: {
            assigneeId: Number(payload.id)
        }
    })

    return NextResponse.json({ success: true });
}