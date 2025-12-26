import { addDays, differenceInDays } from "date-fns";

/**
 * Calcula a nova expiração baseada no plano de 30 dias
 * Regra: Nova Expiração = Data Renovação + 30 - X (dias de graça usados)
 */
export function calculateNewExpiration(useGracePeriod: boolean, graceStartedAt: Date | null) {
  const now = new Date();
  let daysToSubtract = 0;

  if (useGracePeriod && graceStartedAt) {
    // Calcula quantos dias o lojista ficou no "Modo Alerta"
    daysToSubtract = differenceInDays(now, graceStartedAt);
  }

  // Fórmula LaTeX: $$Nova \text{ Expiração} = \text{Data Renovação} + 30 - X$$
  return addDays(now, 30 - daysToSubtract);
}