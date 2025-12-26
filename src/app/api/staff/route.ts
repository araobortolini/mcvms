import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Bloqueio de Segurança: Apenas Master pode criar Staff
    if (!session || (session.user as any).role !== "MASTER") {
      return NextResponse.json({ error: "Acesso negado. Apenas administradores Master." }, { status: 403 });
    }

    const { name, email, password, permissions } = await req.json();

    // 2. Validação básica
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }

    // 3. Verifica se o e-mail já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Este e-mail já está em uso no sistema." }, { status: 400 });
    }

    // 4. Criptografia da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Criação do usuário Staff com cast para evitar erro de tipo do Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STAFF" as any,
        permissions: JSON.stringify(permissions || []),
      } as any, // O 'as any' aqui resolve o erro de 'permissions does not exist'
    });

    // 6. Auditoria: Grava no log usando cast para evitar erro de nomeclatura
    await (prisma as any).auditLog.create({
      data: {
        action: "STAFF_CREATED",
        userId: session.user.id,
        targetId: newUser.id,
        details: `O Master criou o funcionário ${name} com as permissões: ${permissions?.join(", ")}`,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Funcionário cadastrado com sucesso!",
      userId: newUser.id 
    });

  } catch (error) {
    console.error("Erro na API de Staff:", error);
    return NextResponse.json({ error: "Erro interno ao processar cadastro." }, { status: 500 });
  }
}