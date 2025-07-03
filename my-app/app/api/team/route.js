import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(request) {
    const token = request.cookies.get('token');
    const payload = await verifyToken(token.value);
    if (payload) {
        const user = await prisma.user.findUnique({
            where: {
                username: payload.email
            }
        });
        console.log(user);
        if (user && !user.teamId) {
            console.log('user', user)
            const team = await prisma.team.create({
                data: {
                    name: payload.email + '\'s Team'
                }
            })
            await prisma.user.update({
                where: { username: payload.email },
                data: {
                    teamId: Number(team.id)
                }
            });
            
            return NextResponse.json({ success: true });
        }
        else {
            return NextResponse.json({ error: 'User not found or user is already in team' }, { status: 400 })
        }
    }

    return NextResponse.json({ error: "Some error occured" }, { status: 400 })
}