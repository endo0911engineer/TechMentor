import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("access_token")?.value;
  const role = req.cookies.get("role")?.value;
  const profileCompleted = req.cookies.get("is_profile_completed")?.value;

  // 未ログイン
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ログイン済みだが role 未選択
  if (token && !role && pathname !== "/select-role") {
    return NextResponse.redirect(new URL("/select-role", req.url));
  }

  // role 選択済みだがプロフィール未完了
  if (
    token &&
    role &&
    profileCompleted !== "true" &&
    !pathname.startsWith("/profile")
  ) {
    return NextResponse.redirect(new URL("/profile/setup", req.url));
  }

  // userがinterviewer画面に行こうとした場合
  if (role === "user" && pathname.startsWith("/interviewer")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // interviewerがuser画面に行こうとした場合
  if (role === "interviewer" && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api).*)",
  ],
};
