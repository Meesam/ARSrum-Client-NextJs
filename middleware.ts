import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const middleware = async (request: NextRequest) => {
  return NextResponse.next();
};

// This function can be marked `async` if using `await` inside
/*export const middleware = async (request: NextRequest) => {
  const cookieStore = await cookies();
  let token = cookieStore.get("app-token");
  if (token && token?.value !== "") {
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/register") ||
      request.nextUrl.pathname.startsWith("/")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard", "/login"],
};*/
