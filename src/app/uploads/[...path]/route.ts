import { connection } from "next/server";
import { serveUploadResponse } from "@/lib/db/serve-upload";

type RouteContext = { params: Promise<{ path: string[] }> };

/** Serve runtime uploads — Next does not pick up new public/ files until restart. */
export async function GET(_request: Request, context: RouteContext) {
  await connection();
  const { path: parts } = await context.params;
  return serveUploadResponse(parts);
}

export async function HEAD(request: Request, context: RouteContext) {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
