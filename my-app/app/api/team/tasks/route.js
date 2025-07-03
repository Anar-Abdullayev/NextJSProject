import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const payload = await verifyToken(tokenCookie.value);

    if (!payload.teamId)
        return NextResponse.json({ error: 'User is not in any team' }, { status: 400 });


    const teamId = Number(payload.teamId);

    if (Number.isNaN(teamId)) {
        return NextResponse.json(
            { error: 'Query parameter "teamId" (integer) is required.' },
            { status: 400 },
        );
    }

    try {
        const tasks = await prisma.task.findMany({
            where: {
                teamId,
                status: { in: ['TODO', 'IN_PROGRESS'] },
            },
            include: {
                assignee: {
                    select: { id: true, name: true, surname: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(tasks); // 200 OK
    } catch (err) {
        console.error('[GET /api/team/tasks]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}

const ALLOWED_STATUS = ['TODO', 'IN_PROGRESS', 'DONE'];

export async function POST(req) {
    const tokenCookie = await cookies().get('token');
    if (!tokenCookie) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(tokenCookie.value);
    if (!payload?.teamId) {
        return NextResponse.json({ error: 'Requester is not in a team' }, { status: 400 });
    }

    let body = await req.json();
    const { title, description, status, dueDate, assigneeId } = body || {};

    if (!title?.trim()) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!ALLOWED_STATUS.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const cleanTitle = title.trim();
    const cleanDescription = description?.trim() || null;
    const parsedDueDate = dueDate && !isNaN(Date.parse(dueDate)) ? new Date(dueDate) : null;
    const cleanAssigneeId = assigneeId != null ? Number(assigneeId) : null;

    if (cleanAssigneeId !== null) {
        const assignee = await prisma.user.findUnique({
            where: { id: cleanAssigneeId },
            select: { teamId: true },
        });
        if (!assignee || assignee.teamId !== payload.teamId) {
            return NextResponse.json(
                { error: 'Assignee not found in your team' },
                { status: 400 },
            );
        }
    }

    try {
        const task = await prisma.task.create({
            data: {
                title: cleanTitle,
                description: cleanDescription,
                status,
                dueDate: parsedDueDate,
                teamId: Number(payload.teamId),
                assigneeId: cleanAssigneeId, // can be null
            },
        });
        const newTask = await prisma.task.findUnique({
            where: { id: task.id },
            include: { assignee: true }
        })
        return NextResponse.json(newTask, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}


export async function DELETE(req) {
    const tokenCookie = await cookies().get('token');
    if (!tokenCookie) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(tokenCookie.value);
    if (!payload?.teamId) {
        return NextResponse.json({ error: 'Requester is not in a team' }, { status: 400 });
    }

    let taskBody = await req.json();

    const deletedTask = await prisma.task.findUnique({
        where: { id: Number(taskBody.id) }
    })

    if (deletedTask.teamId !== payload.teamId) return NextResponse({ error: 'Task is not requesters team task' }, { status: 400 })

    await prisma.task.delete({
        where: { id: deletedTask.id }
    })
    return NextResponse.json({ success: true })
}