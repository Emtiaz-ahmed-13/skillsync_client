"use server";

import { RegisterData } from "@/types/auth";

export const registerUser = async (data: RegisterData) => {
  const res = await fetch(`${process.env.BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    cache: "no-store",
  });
  const userInfo = await res.json();
  return userInfo;
};
