import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "MASTER") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const { name, email, password } = await req.json();
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STAFF"
      }
    });

    return NextResponse.json({ id: newStaff.id, email: newStaff.email });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar staff" }, { status: 500 });
  }
}
