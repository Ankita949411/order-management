const { PrismaClient } = require('@prisma/client');
const { menuItems } = require('./menu-seed');

const prisma = new PrismaClient();

async function main() {
  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: {
        name: item.name
      },
      update: {
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.imageUrl,
        isAvailable: true
      },
      create: {
        name: item.name,
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.imageUrl,
        isAvailable: true
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
