import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Apenas MASTER pode criar
    if (!session || (session.user as any).role !== "MASTER") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Preencha todos os campos." }, { status: 400 });
    }

    // 2. Verifica duplicidade
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 400 });
    }

    // 3. Criptografa a senha e cria o usuário
    const hashedPassword = await bcrypt.hash(password, 10);

    const newReseller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "RESELLER",
        credits: 0, 
        // Usamos 'as any' para evitar erro de tipo do Enum (STANDARD vs Tier.STANDARD)
        tier: "STANDARD" as any
      }
    });

    return NextResponse.json(newReseller);

  } catch (error) {
    console.error("ERRO AO CRIAR REVENDEDOR:", error);
    return NextResponse.json({ error: "Erro interno ao cadastrar." }, { status: 500 });
  }
}