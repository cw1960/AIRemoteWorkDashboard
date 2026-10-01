import "server-only";

import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { CardKind, Stage } from "./stages";

/** One card on the board, with what its tile shows. */
export interface BoardCard {
  id: string;
  kind: CardKind;
  title: string;
  stage: Stage;
  position: number;
  nextActionAt: string | null;
  /** The platform for job and platform cards. */
  platformName: string | null;
  /** Job cards only. */
  job: {
    id: string;
    closed: boolean;
    payMin: number | null;
    payMax: number | null;
    payUnit: string | null;
  } | null;
}

/** The signed-in user's cards, column by column; null when signed out. */
export async function getBoard(): Promise<BoardCard[] | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tracker_cards")
    .select(
      "id, kind, title, stage, position, next_action_at, platform:platforms(name), job:jobs(id, status, pay_min, pay_max, pay_unit, platform:platforms!inner(name))",
    )
    .eq("user_id", user.id)
    .order("position")
    .order("created_at");
  if (error) throw new Error(error.message);

  return data.map((card) => ({
    id: card.id,
    kind: card.kind,
    title: card.title,
    stage: card.stage,
    position: card.position,
    nextActionAt: card.next_action_at,
    platformName: card.job?.platform.name ?? card.platform?.name ?? null,
    job: card.job
      ? {
          id: card.job.id,
          closed: card.job.status !== "open",
          payMin: card.job.pay_min,
          payMax: card.job.pay_max,
          payUnit: card.job.pay_unit,
        }
      : null,
  }));
}
