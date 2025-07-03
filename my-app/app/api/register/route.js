import prisma from "@/lib/prisma";

export async function POST(req){
    const { firstName, lastName, email, password } = await req.json();

    const currentUser = await prisma.user.findFirst({
        where: {
            username: email
        }
    })
    if (currentUser)
        return Response.json({status: 400, message: 'User already exists'})

    const createdUser = await prisma.user.create({
        data: {
            name: firstName,
            surname: lastName,
            username: email,
            password: password
        }
    })
    
    return Response.json({status: 200, message: 'Created', data: createdUser})
}