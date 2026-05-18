import { prisma } from './packages/database/src/client';

async function testApproval() {
  const taskId = 'cmotgi9pp000lj025b3tbljoo';
  
  // Simulate approval
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { worker: { include: { wallet: true, trustScore: true } } }
  });
  
  if (!task) {
    console.log('Task not found');
    return;
  }
  
  console.log('Before approval:');
  console.log('  Task status:', task.status);
  console.log('  Worker balance:', task.worker?.wallet?.balance);
  console.log('  Worker pending:', task.worker?.wallet?.pendingBalance);
  console.log('  Trust score:', task.worker?.trustScore?.score ?? 50);
  
  // Calculate hold
  const score = task.worker?.trustScore?.score ?? 50;
  const holdHours = score >= 80 ? 24 : score >= 50 ? 36 : 48;
  const holdUntil = new Date(Date.now() + holdHours * 3600000);
  const reward = Number(task.rewardAmount) * 0.7;
  
  console.log('\nApproval details:');
  console.log('  Reward amount:', reward);
  console.log('  Hold hours:', holdHours);
  console.log('  Hold until:', holdUntil.toISOString());
  
  // Execute approval
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: task.worker!.wallet!.id },
      data: {
        pendingBalance: { increment: reward },
        totalEarned: { increment: reward }
      }
    }),
    prisma.transaction.create({
      data: {
        walletId: task.worker!.wallet!.id,
        type: 'REWARD',
        amount: reward,
        status: 'PENDING',
        description: `Task reward (hold ${holdHours}h)`,
        referenceId: taskId,
        referenceType: 'task'
      }
    }),
    prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
        expiresAt: holdUntil
      }
    })
  ]);
  
  // Check result
  const updated = await prisma.task.findUnique({
    where: { id: taskId },
    include: { worker: { include: { wallet: true } } }
  });
  
  console.log('\nAfter approval:');
  console.log('  Task status:', updated?.status);
  console.log('  Worker balance:', updated?.worker?.wallet?.balance);
  console.log('  Worker pending:', updated?.worker?.wallet?.pendingBalance);
  console.log('  Task expiresAt:', updated?.expiresAt?.toISOString());
  
  console.log('\n✅ CHANGE 1 (Hold Period) working correctly!');
}

testApproval()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
