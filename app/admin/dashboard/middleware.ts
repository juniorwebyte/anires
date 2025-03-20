import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkAdminSession } from "@/app/actions"

export async function middleware(request: NextRequest) {
  try {
    const sessionCheck = await checkAdminSession()

    if (!sessionCheck.authenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Erro no middleware:", error)
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
}

export const config = {
  matcher: "/admin/dashboard/:path*",
}

