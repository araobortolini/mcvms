import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { subject, category, description, priority } = body;

    const report = await prisma.report.create({
      data: {
        subject,
        category,
        description,
        priority: priority || "NORMAL",
        userId: session.user.id,
        status: "ABERTO"
      }
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
