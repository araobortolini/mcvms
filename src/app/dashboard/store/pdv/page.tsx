import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PdvClient from "./pdv-client";

export default async function PdvPage() {
  const session = await getServerSession(authOptions);
  
  const products = await prisma.product.findMany({
    where: { 
      userId: session?.user?.id,
      stock: { gt: 0 } 
    },
    include: { category: true }
  });

  return (
    <div className="h-[calc(100vh-120px)]">
      <PdvClient products={products} />
    </div>
  );
}
