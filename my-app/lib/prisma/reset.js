const { PrismaClient, TaskStatus } = require('@prisma/client');

const prisma = new PrismaClient();

const randomFutureDate = (daysAhead = 30) =>
  new Date(Date.now() + Math.floor(Math.random() * daysAhead) * 86_400_000);

async function main() {
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});

  const team = await prisma.team.create({
    data: { name: 'First Custom Team' },
  });

  const user1 = await prisma.user.create({
    data: {
      username: 'user1@gmail.com',
      password: 'user1234',
      name: 'User',
      surname: 'Surname',
      teamId: team.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'user2@gmail.com',
      password: 'user1234',
      name: 'User2',
      surname: 'Surname2',
      teamId: team.id,
    },
  });
  const tasksData = [
    ...[TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE].flatMap(
      status => [
        {
          title: `Task for ${user1.username} (${status}) A`,
          description: `Demo ${status} task A`,
          status,
          dueDate: randomFutureDate(),
          teamId: team.id,
          assigneeId: user1.id,
        },
        {
          title: `Task for ${user1.username} (${status}) B`,
          description: `Demo ${status} task B`,
          status,
          dueDate: randomFutureDate(),
          teamId: team.id,
          assigneeId: user1.id,
        },
      ],
    ),

    ...[TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE].map(status => ({
      title: `Task for ${user2.username} (${status})`,
      description: `Demo ${status} task`,
      status,
      dueDate: randomFutureDate(),
      teamId: team.id,
      assigneeId: user2.id,
    })),

    ...Array.from({ length: 3 }).map((_, i) => ({
      title: `Unassigned TODO #${i + 1}`,
      description: 'Available task, grab it!',
      status: TaskStatus.TODO,
      dueDate: randomFutureDate(),
      teamId: team.id,
      assigneeId: null,
    })),
  ];

  await prisma.task.createMany({ data: tasksData });

  console.log('✅ Database reset complete with mock data');
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
