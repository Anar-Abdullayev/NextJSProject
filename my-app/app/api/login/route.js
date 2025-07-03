import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/jwt';

export async function POST(req) {
  const { email, password } = await req.json();

  const valid = await prisma.user.findFirst({
    where: {
      username: email,
      password: password
    }
  });

  if (!valid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signToken({ id: valid.id, email: valid.username, teamId: valid.teamId });

  const cookieStore = await cookies();
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  const user = {
    email: valid.username,
    name: valid.name,
    surname: valid.surname,
    teamId: valid.teamId
  }
  return NextResponse.json({ ok: true, data: user });
}