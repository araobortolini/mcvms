const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "master@admin.com"; // Você pode alterar este e-mail
  const password = "masterpassword"; // Você pode alterar esta senha
  const name = "Super Admin Master";

  // 1. Verificar se já existe
  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    console.log("O usuário Master já existe no banco de dados.");
    return;
  }

  // 2. Criptografar senha
  const hashedPassword = await hash(password, 10);

  // 3. Criar usuário com papel MASTER
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "MASTER", // Definindo o cargo mais alto
    },
  });

  console.log("--------------------------------------");
  console.log("SUPER ADMIN CRIADO COM SUCESSO!");
  console.log(`E-mail: ${email}`);
  console.log(`Senha: ${password}`);
  console.log("--------------------------------------");
}

main()
  .catch((e) => {
    console.error("Erro ao criar Master:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });