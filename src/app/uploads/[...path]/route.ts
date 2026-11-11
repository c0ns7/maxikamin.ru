import { serveUploadResponse } from "@/lib/db/serve-upload";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

/** Serve runtime uploads — Next does not pick up new public/ files until restart. */
export async function GET(_request: Request, context: RouteContext) {
  const { path: parts } = await context.params;
  return serveUploadResponse(parts);
}

export async function HEAD(_request: Request, context: RouteContext) {
  const response = await GET(_request, context);
  return new Response(null, { status: response.status, headers: response.headers });
}
