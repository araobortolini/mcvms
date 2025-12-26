import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@pluspdv.com";
  const password = "admin123"; // ALTERE ESTA SENHA APÓS O PRIMEIRO LOGIN
  const hashedPassword = await bcrypt.hash(password, 10);

  const master = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Administrador Master",
      password: hashedPassword,
      role: "MASTER",
      credits: 999999,
    },
  });

  console.log("--------------------------------------");
  console.log("Usuário Master criado com sucesso!");
  console.log(`E-mail: ${master.email}`);
  console.log(`Senha: ${password}`);
  console.log("--------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
