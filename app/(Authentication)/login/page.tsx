"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/app/(Authentication)/(authService)";
import { redirect } from "next/navigation";
import { LoginResponseType } from "@/lib/appTypes/auth/LoginResponseType";
import { CookieValueTypes, getCookie } from "cookies-next";
import React from "react";

const formSchema = z.object({
  userName: z.string().min(2, {
    message: "userName must be at least 2 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 6 characters.",
  }),
});

const LoginPage = () => {
  const [appToken, setAppToken] = React.useState<
    CookieValueTypes | Promise<CookieValueTypes>
  >(undefined);
  const [tokenExpiry, setTokenExpiry] = React.useState<
    CookieValueTypes | Promise<CookieValueTypes>
  >(undefined);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      userName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let resp: LoginResponseType = await loginUser(values);
    if (resp.status === "Success") {
      const userInfo = {
        userName: resp.userName,
        firstName: resp.firstName,
        lastName: resp.lastName,
        email: resp.email,
        role: resp.roles,
        userId: resp.userId,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      redirect("/dashboard");
    }
  };

  React.useEffect(() => {
    const jwtToken: CookieValueTypes | Promise<CookieValueTypes> =
      getCookie("app-token");
    const tokenExpiry: CookieValueTypes | Promise<CookieValueTypes> =
      getCookie("token-expiry");
    setAppToken(jwtToken);
    setTokenExpiry(tokenExpiry);
  }, []);

  return (
    <div className="p-10 border border-gray-200 rounded-lg w-96">
      <h1 className="text-2xl font-bold pb-10">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
};
export default LoginPage;
