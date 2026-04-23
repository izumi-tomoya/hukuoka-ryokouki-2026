"use server";

import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";

export async function toggleSecretModeAction() {
  const cookieStore = await cookies();
  const current = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";
  
  cookieStore.set(SECRET_MODE_COOKIE_NAME, (!current).toString(), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: false,
  });
}
