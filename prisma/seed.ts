import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";

async function main() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const data = await auth.api.signUpEmail({
      body: {
        name: "Super Admin",
        username: "admin11",
        displayUsername: "admin11",
        email: adminEmail ?? "",
        password: adminPassword ?? "",
      },
    });

    await prisma.user.update({
      where: {
        id: data.user.id,
      },
      data: {
        role: "ADMIN",
        emailVerified: true,
      },
    });

    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
