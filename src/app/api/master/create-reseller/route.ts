import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const reseller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "RESELLER", // Define como Revendedor
        credits: 0
      }
    });

    return NextResponse.json(reseller);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar revendedor" }, { status: 500 });
  }
}