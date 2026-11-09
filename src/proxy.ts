import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Reserved for edge redirects; auth is enforced in admin layout. */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
