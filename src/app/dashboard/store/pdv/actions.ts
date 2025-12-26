"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function processSale(cart: any[], paymentMethod: string) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Não autorizado");

  const total = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  await prisma.$transaction(async (tx) => {
    // 1. Criar o registro da Venda
    const sale = await tx.sale.create({
      data: {
        userId: session.user.id,
        total,
        paymentMethod,
        items: {
          create: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.salePrice
          }))
        }
      }
    });

    // 2. Atualizar o Estoque de cada produto
    for (const item of cart) {
      const product = await tx.product.findUnique({ where: { id: item.id } });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto: ${item.name}`);
      }

      await tx.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return sale;
  });

  revalidatePath("/dashboard/store/products");
  revalidatePath("/dashboard/store/sales");
}
