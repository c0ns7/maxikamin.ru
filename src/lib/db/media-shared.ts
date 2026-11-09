/** Browser-safe helpers shared with admin UI (no Node/fs). */

export const UPLOAD_PUBLIC_PREFIX = "/uploads/gallery";

export function isUploadedMedia(url: string) {
  return url.startsWith(UPLOAD_PUBLIC_PREFIX);
}
