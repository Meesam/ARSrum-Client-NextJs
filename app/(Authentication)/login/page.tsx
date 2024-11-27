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
  userName: z.string().min(1, {
    message: "Please enter the Username",
  }),
  password: z.string().min(1, {
    message: "Please enter the Password",
  }),
});

const LoginPage = () => {
  const [appToken, setAppToken] = React.useState<
    CookieValueTypes | Promise<CookieValueTypes>
  >(undefined);
  const [tokenExpiry, setTokenExpiry] = React.useState<
    CookieValueTypes | Promise<CookieValueTypes>
  >(undefined);

  const [isLoginFailed, setIsLoginFailed] = React.useState(false);

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
      if (userInfo.role[0].toLowerCase() === "admin") {
        redirect("/admin/dashboard");
      } else {
        redirect("/user/dashboard");
      }
    } else if (resp.status === "Error") {
      setIsLoginFailed(true);
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
      {isLoginFailed && (
        <p className="text-red-500 text-sm pb-5">
          Incorrect Username or Password! Try again
        </p>
      )}
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
