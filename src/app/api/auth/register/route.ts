import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client"; 

export async function POST(req: Request) {
  try {
    const { name, email, password, storeName } = await req.json();

    // 1. Verificar se e-mail existe
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 });
    }

    // 2. Criptografar senha
    const hashedPassword = await hash(password, 10);

    // 3. Validade de 30 dias
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);

    // 4. Criar Usuário e Loja
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.STORE_OWNER, 
        storeInfo: {            
          create: {
            name: storeName,
            expirationDate: expirationDate,
            status: "ACTIVE"
          },
        },
      },
    });

    return NextResponse.json({ message: "Criado com sucesso!" }, { status: 201 });
  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}