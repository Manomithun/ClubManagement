import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({});

async function main() {
  try {
    // Upsert a department so the seed is idempotent
    let department = await prisma.department.findFirst({
      where: { name: "Computer Science" },
    });

    if (!department) {
      department = await prisma.department.create({
        data: { name: "Computer Science" },
      });
      console.log("✅ Department created:", department.name);
    } else {
      console.log("ℹ️  Department already exists:", department.name);
    }

    // Create SYSTEM_ADMIN: admin1@gmail.com / Admin@123
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin1@gmail.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);
      const admin = await prisma.user.create({
        data: {
          name: "System Admin",
          email: "admin1@gmail.com",
          password: hashedPassword,
          role: "SYSTEM_ADMIN",
          deptId: department.id,
        },
      });
      console.log("✅ Admin user created:", admin.email);
      console.log("   Password: Admin@123");
    } else {
      console.log("ℹ️  Admin user already exists:", existingAdmin.email);
    }
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();