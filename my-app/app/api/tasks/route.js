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

    try {
        const tasks = await prisma.task.findMany({
            where: {
                assigneeId: payload.id,
                teamId: Number(payload.teamId)
            },
            include: {
                assignee: {
                    select: { id: true, name: true, surname: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(tasks);
    } catch (err) {
        console.error('[GET /api/team/tasks]', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}


export async function PUT(req) {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const payload = await verifyToken(tokenCookie.value);
    const data = await req.json();
    const { id, assignee, teamId, ...rest } = data;



    const task = prisma.task.findUnique({
        where: { id: id }
    })
    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })


    await prisma.task.update({
        where: { id: Number(data.id) },
        data: rest
    })
    return NextResponse.json({ success: true });
}