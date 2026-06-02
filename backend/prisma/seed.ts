import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    ['customers.create', 'Create Customers'],
    ['customers.view', 'View Customers'],
    ['financing_applications.create', 'Create Applications'],
    ['financing_applications.view', 'View Applications'],
    ['financing_applications.status.update', 'Update Application Status'],
    ['dashboard.view', 'View Dashboard']
  ];

  for (const [code, name] of permissions) {
    await prisma.permission.upsert({
      where: { code },
      create: { code, name },
      update: { name }
    });
  }

  const superAdminRole = await prisma.role.upsert({
    where: { code: 'super_admin' },
    create: { code: 'super_admin', name: 'Super Admin' },
    update: { name: 'Super Admin' }
  });

  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id
        }
      },
      create: { roleId: superAdminRole.id, permissionId: permission.id },
      update: {}
    });
  }

  const passwordHash = await argon2.hash('Admin@123');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lms.local' },
    create: {
      username: 'superadmin',
      email: 'admin@lms.local',
      passwordHash,
      status: 'active'
    },
    update: { passwordHash }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: superAdminRole.id
      }
    },
    create: { userId: adminUser.id, roleId: superAdminRole.id },
    update: {}
  });

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
