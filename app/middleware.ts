import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const headers = new Headers(req.headers);

  headers.set("Access-Control-Allow-Origin", "*"); // ✅ Allows all origins (change in production)
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return NextResponse.next({ headers });
}

// ✅ Apply this middleware only to API routes
export const config = {
  matcher: "/api/:path*",
};
