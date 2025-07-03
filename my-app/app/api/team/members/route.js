import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const payload = await verifyToken(token.value);
    if (!payload.teamId)
        return NextResponse.json({ data: [] }, { status: 200 })

    var users = await prisma.user.findMany({
        where: {
            teamId: Number(payload.teamId)
        }
    })

    return NextResponse.json(users);
}

export async function POST(req) {
    const data = await req.json();
    const user = await prisma.user.findUnique({
        where: {
            username: data
        }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.teamId) return NextResponse.json({ error: 'User is already in team' }, { status: 400 });

    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const payload = await verifyToken(token.value);
    if (!payload.teamId)
        return NextResponse.json({ error: 'Requester is not in team' }, { status: 400 })

    await prisma.user.update({
        where: { username: user.username },
        data: {
            teamId: Number(payload.teamId)
        }
    })
    return NextResponse.json({ success: true })
}

export async function DELETE(req) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload = await verifyToken(token.value);
    if (!payload.teamId) {
        return NextResponse.json({ error: 'Requester is not in team' }, { status: 400 });
    }

    const userData = await req.json();
    const removedUser = await prisma.user.findUnique({ where: { id: Number(userData.id) } });

    if (!removedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (removedUser.teamId !== payload.teamId || removedUser.username === payload.email) {
        return NextResponse.json(
            { error: 'Either user is removing themselves or teams differ' },
            { status: 400 },
        );
    }

    try {
        await prisma.$transaction([
            prisma.task.updateMany({
                where: {
                    assigneeId: removedUser.id,
                    status: { in: ['TODO', 'IN_PROGRESS'] },
                },
                data: {
                    status: 'TODO',
                    assigneeId: null,
                },
            }),

            prisma.user.update({
                where: { id: removedUser.id },
                data: { teamId: null },
            }),
        ]);

        return NextResponse.json({ message: 'Member removed and tasks reset' }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
