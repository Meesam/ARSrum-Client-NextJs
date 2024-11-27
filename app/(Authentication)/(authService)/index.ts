"use server";
import { RegisterUser } from "@/lib/appTypes/auth/RegisterUser";
import { LoginUser } from "@/lib/appTypes/auth/LoginUser";
import { cookies } from "next/headers";
import { LoginResponseType } from "@/lib/appTypes/auth/LoginResponseType";

export const registerUser = async (registerUser: RegisterUser) => {
  const apiUrl = `${process.env.API_BASE_URL}/Authentication/RegisterUser`;
  let resp: Response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(registerUser),
  });
  return resp.json();
};

export const loginUser = async (loginUser: LoginUser) => {
  const apiUrl = `${process.env.API_BASE_URL}/Authentication/login`;
  let resp: Response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(loginUser),
  });
  const cookieStore = await cookies();
  let data: LoginResponseType = await resp.json();
  if (data.status === "Success") {
    cookieStore.set("app-token", data.token);
    cookieStore.set("token-expiry", data.expiration.toString());
  }
  return data;
};
