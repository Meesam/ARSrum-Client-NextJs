import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import moment from "moment";

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  const cookieStore = await cookies();
  let token: RequestCookie | undefined = cookieStore.get("app-token");
  let roles: RequestCookie | undefined = cookieStore.get("user-role");
  let tokenExpiry: RequestCookie | undefined = cookieStore.get("token-expiry");
  let tokenExpiryDate = null;
  let userRole: string[] = [];
  if (tokenExpiry && tokenExpiry.value) {
    tokenExpiryDate = moment(tokenExpiry.value).format("YYYY-MM-DD HH:mm:ss");
    if (tokenExpiryDate > moment().format("YYYY-MM-DD HH:mm:ss")) {
      console.log("Token expiry expired");
    }
  }
  console.log("tokenExpiryDate ", tokenExpiryDate);
  if (roles && roles.value) {
    userRole = JSON.parse(roles.value);
  }
  if (token && token?.value !== "") {
    switch (userRole[0]) {
      case "Admin":
        if (request.nextUrl.pathname.startsWith("/admin")) {
          return NextResponse.next();
        } else {
          if (
            request.nextUrl.pathname.startsWith("/login") ||
            request.nextUrl.pathname.startsWith("/register") ||
            request.nextUrl.pathname === "/"
          ) {
            return NextResponse.redirect(
              new URL("/admin/dashboard", request.url),
            );
          } else {
            if (request.nextUrl.pathname.startsWith("/user")) {
              return NextResponse.redirect(new URL("/not-found", request.url));
            }
          }
        }
        break;
      case "User":
        if (request.nextUrl.pathname.startsWith("/user")) {
          return NextResponse.next();
        } else {
          if (
            request.nextUrl.pathname.startsWith("/login") ||
            request.nextUrl.pathname.startsWith("/register") ||
            request.nextUrl.pathname === "/"
          ) {
            return NextResponse.redirect(
              new URL("/user/dashboard", request.url),
            );
          } else {
            if (request.nextUrl.pathname.startsWith("/admin")) {
              return NextResponse.redirect(new URL("/not-found", request.url));
            }
          }
        }
        break;
    }
  } else {
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname === "/"
    ) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/login", "/register", "/"],
};
