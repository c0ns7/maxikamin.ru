"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
} from "@/lib/auth/admin";
import {
  changeAdminPassword,
  verifyAdminPassword,
} from "@/lib/auth/password";
import {
  deleteMedia,
  replaceMedia,
  saveUploadedMedia,
} from "@/lib/db/media";
import {
  createProduct,
  deleteBrand,
  deleteCategory,
  deletePortfolioItem,
  deleteProduct,
  deletePromo,
  deleteReview,
  nextProductId,
  saveSettings,
  updateProduct,
  upsertBrand,
  upsertCategory,
  upsertPortfolioItem,
  upsertPromo,
  upsertReview,
  getSettings,
} from "@/lib/db/queries";
import type {
  PageFact,
  PageStage,
  PortfolioItem,
  Product,
  Promo,
  Review,
  SiteSettings,
} from "@/lib/types";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/catalog");
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath("/promo");
  revalidatePath("/portfolio");
  revalidatePath("/about");
  revalidatePath("/production");
  revalidatePath("/contacts");
  revalidatePath("/delivery");
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }
  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || nextProductId());
  const specsRaw = String(formData.get("specs") ?? "").trim();
  let specs: Record<string, string> | undefined;
  if (specsRaw) {
    try {
      specs = JSON.parse(specsRaw);
    } catch {
      specs = Object.fromEntries(
        specsRaw
          .split("\n")
          .map((line) => line.split(":").map((s) => s.trim()))
          .filter((p) => p.length >= 2)
          .map(([k, ...rest]) => [k, rest.join(":")]),
      );
    }
  }

  const payload: Product = {
    id,
    name: String(formData.get("name") ?? "").trim(),
    brand: String(formData.get("brand") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    price: Number(formData.get("price") ?? 0),
    image: String(formData.get("image") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    specs,
    line: String(formData.get("line") ?? "").trim() || undefined,
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };

  if (!payload.name || !payload.brand || !payload.category) {
    redirect("/admin/products/new?error=1");
  }

  const existingId = String(formData.get("id") ?? "");
  if (existingId) updateProduct(existingId, payload);
  else createProduct(payload);

  revalidateSite();
  revalidatePath(`/product/${id}`);
  redirect(`/admin/products/${id}`);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) deleteProduct(id);
  revalidateSite();
  redirect("/admin/products");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  upsertCategory({
    id: String(formData.get("id") || undefined) || undefined,
    name: String(formData.get("name") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidateSite();
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  deleteCategory(String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/categories");
}

export async function saveBrandAction(formData: FormData) {
  await requireAdmin();
  const assortment = String(formData.get("assortment") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  upsertBrand({
    id: String(formData.get("id") || undefined) || undefined,
    name: String(formData.get("name") ?? "").trim(),
    assortment,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
  revalidateSite();
  redirect("/admin/brands");
}

export async function deleteBrandAction(formData: FormData) {
  await requireAdmin();
  deleteBrand(String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/brands");
}

export async function saveReviewAction(formData: FormData) {
  await requireAdmin();
  const review: Review = {
    id: String(formData.get("id") || `r-${Date.now()}`),
    name: String(formData.get("name") ?? "").trim(),
    place: String(formData.get("place") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  upsertReview(review);
  revalidateSite();
  redirect("/admin/reviews");
}

export async function deleteReviewAction(formData: FormData) {
  await requireAdmin();
  deleteReview(String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/reviews");
}

export async function savePromoAction(formData: FormData) {
  await requireAdmin();
  const promo: Promo = {
    id: String(formData.get("id") || `p-${Date.now()}`),
    title: String(formData.get("title") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    until: String(formData.get("until") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  upsertPromo(promo);
  revalidateSite();
  redirect("/admin/promos");
}

export async function deletePromoAction(formData: FormData) {
  await requireAdmin();
  deletePromo(String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/promos");
}

export async function savePortfolioAction(formData: FormData) {
  await requireAdmin();
  const item: PortfolioItem = {
    id: String(formData.get("id") || `pf-${Date.now()}`),
    title: String(formData.get("title") ?? "").trim(),
    place: String(formData.get("place") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    active: formData.get("active") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  upsertPortfolioItem(item);
  revalidateSite();
  redirect("/admin/portfolio");
}

export async function deletePortfolioAction(formData: FormData) {
  await requireAdmin();
  deletePortfolioItem(String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/portfolio");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const current = getSettings();
  const featuredRaw = String(formData.get("featuredProductIds") ?? "");
  const featuredProductIds = featuredRaw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const next: SiteSettings = {
    ...current,
    contacts: {
      phone: String(formData.get("phone") ?? current.contacts.phone),
      phone2: String(formData.get("phone2") ?? current.contacts.phone2),
      phone3: String(formData.get("phone3") ?? current.contacts.phone3),
      email: String(formData.get("email") ?? current.contacts.email),
      site: String(formData.get("site") ?? current.contacts.site),
      address: String(formData.get("address") ?? current.contacts.address),
      hours: String(formData.get("hours") ?? current.contacts.hours),
      hoursNote: String(formData.get("hoursNote") ?? current.contacts.hoursNote),
      socialMax: String(formData.get("socialMax") ?? current.contacts.socialMax),
      socialTelegram: String(
        formData.get("socialTelegram") ?? current.contacts.socialTelegram,
      ),
      socialWhatsapp: String(
        formData.get("socialWhatsapp") ?? current.contacts.socialWhatsapp,
      ),
      deliveryLocal: String(
        formData.get("deliveryLocal") ?? current.contacts.deliveryLocal,
      ),
      deliveryRegions: String(
        formData.get("deliveryRegions") ?? current.contacts.deliveryRegions,
      ),
    },
    hero: {
      headline: String(formData.get("headline") ?? current.hero.headline),
      subtitle: String(formData.get("subtitle") ?? current.hero.subtitle),
      image: String(formData.get("heroImage") ?? current.hero.image),
      ctaPrimary: String(formData.get("ctaPrimary") ?? current.hero.ctaPrimary),
      ctaSecondary: String(
        formData.get("ctaSecondary") ?? current.hero.ctaSecondary,
      ),
    },
    featuredProductIds,
    metaTitle: String(formData.get("metaTitle") ?? current.metaTitle),
    metaDescription: String(
      formData.get("metaDescription") ?? current.metaDescription,
    ),
  };

  saveSettings(next);
  revalidateSite();
  redirect("/admin/settings?saved=1");
}

function readFacts(formData: FormData, count = 6): PageFact[] {
  const facts: PageFact[] = [];
  for (let i = 0; i < count; i++) {
    const n = String(formData.get(`fact_n_${i}`) ?? "").trim();
    const label = String(formData.get(`fact_label_${i}`) ?? "").trim();
    if (n || label) facts.push({ n, label });
  }
  return facts;
}

function readStages(formData: FormData, count = 6): PageStage[] {
  const stages: PageStage[] = [];
  for (let i = 0; i < count; i++) {
    const n = String(formData.get(`stage_n_${i}`) ?? "").trim();
    const title = String(formData.get(`stage_title_${i}`) ?? "").trim();
    const text = String(formData.get(`stage_text_${i}`) ?? "").trim();
    const image = String(formData.get(`stage_image_${i}`) ?? "").trim();
    if (n || title || text || image) {
      stages.push({ n, title, text, image });
    }
  }
  return stages;
}

export async function savePagesAction(formData: FormData) {
  await requireAdmin();
  const current = getSettings();
  const page = String(formData.get("page") ?? "");

  let pages = current.pages;
  let contacts = current.contacts;

  if (page === "about") {
    pages = {
      ...pages,
      about: {
        eyebrow: String(formData.get("eyebrow") ?? pages.about.eyebrow),
        title: String(formData.get("title") ?? pages.about.title),
        lead: String(formData.get("lead") ?? pages.about.lead),
        image: String(formData.get("image") ?? pages.about.image),
        body1: String(formData.get("body1") ?? pages.about.body1),
        body2: String(formData.get("body2") ?? pages.about.body2),
        facts: readFacts(formData),
        brandsTitle: String(
          formData.get("brandsTitle") ?? pages.about.brandsTitle,
        ),
        showBrands: formData.get("showBrands") === "on",
        metaTitle: String(formData.get("metaTitle") ?? pages.about.metaTitle),
        metaDescription: String(
          formData.get("metaDescription") ?? pages.about.metaDescription,
        ),
      },
    };
  } else if (page === "production") {
    pages = {
      ...pages,
      production: {
        eyebrow: String(formData.get("eyebrow") ?? pages.production.eyebrow),
        title: String(formData.get("title") ?? pages.production.title),
        lead: String(formData.get("lead") ?? pages.production.lead),
        heroImage: String(
          formData.get("heroImage") ?? pages.production.heroImage,
        ),
        heroCaption: String(
          formData.get("heroCaption") ?? pages.production.heroCaption,
        ),
        video1: String(formData.get("video1") ?? pages.production.video1),
        video1Poster: String(
          formData.get("video1Poster") ?? pages.production.video1Poster,
        ),
        video1Label: String(
          formData.get("video1Label") ?? pages.production.video1Label,
        ),
        video2: String(formData.get("video2") ?? pages.production.video2),
        video2Poster: String(
          formData.get("video2Poster") ?? pages.production.video2Poster,
        ),
        video2Label: String(
          formData.get("video2Label") ?? pages.production.video2Label,
        ),
        stages: readStages(formData),
        metaTitle: String(
          formData.get("metaTitle") ?? pages.production.metaTitle,
        ),
        metaDescription: String(
          formData.get("metaDescription") ?? pages.production.metaDescription,
        ),
      },
    };
  } else if (page === "contacts") {
    pages = {
      ...pages,
      contacts: {
        eyebrow: String(formData.get("eyebrow") ?? pages.contacts.eyebrow),
        title: String(formData.get("title") ?? pages.contacts.title),
        lead: String(formData.get("lead") ?? pages.contacts.lead),
        metaTitle: String(
          formData.get("metaTitle") ?? pages.contacts.metaTitle,
        ),
        metaDescription: String(
          formData.get("metaDescription") ?? pages.contacts.metaDescription,
        ),
      },
    };
  } else if (page === "delivery") {
    pages = {
      ...pages,
      delivery: {
        eyebrow: String(formData.get("eyebrow") ?? pages.delivery.eyebrow),
        title: String(formData.get("title") ?? pages.delivery.title),
        lead: String(formData.get("lead") ?? pages.delivery.lead),
        localTitle: String(
          formData.get("localTitle") ?? pages.delivery.localTitle,
        ),
        regionsTitle: String(
          formData.get("regionsTitle") ?? pages.delivery.regionsTitle,
        ),
        metaTitle: String(
          formData.get("metaTitle") ?? pages.delivery.metaTitle,
        ),
        metaDescription: String(
          formData.get("metaDescription") ?? pages.delivery.metaDescription,
        ),
      },
    };
    contacts = {
      ...contacts,
      deliveryLocal: String(
        formData.get("deliveryLocal") ?? contacts.deliveryLocal,
      ),
      deliveryRegions: String(
        formData.get("deliveryRegions") ?? contacts.deliveryRegions,
      ),
    };
  } else {
    redirect("/admin/pages");
  }

  saveSettings({ ...current, pages, contacts });
  revalidateSite();
  redirect(`/admin/pages?saved=${page}`);
}

export async function changePasswordAction(formData: FormData) {
  await requireAdmin();
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (next !== confirm) {
    redirect("/admin/settings?pwd=mismatch");
  }

  const result = changeAdminPassword(current, next);
  if (!result.ok) {
    redirect(
      `/admin/settings?pwd=${result.error.includes("Текущий") ? "bad" : "short"}`,
    );
  }

  redirect("/admin/settings?pwd=ok");
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) {
    redirect("/admin/media?error=empty");
  }

  try {
    for (const file of files) {
      await saveUploadedMedia(file);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "upload";
    redirect(`/admin/media?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/admin/media");
  redirect("/admin/media?uploaded=1");
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const folder = String(formData.get("folder") ?? "");
  const q = String(formData.get("q") ?? "");
  if (id) deleteMedia(id);
  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
  redirect(mediaRedirect({ folder, q, deleted: "1" }));
}

export async function replaceMediaAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const folder = String(formData.get("folder") ?? "");
  const q = String(formData.get("q") ?? "");
  const file = formData.get("file");

  if (!id || !(file instanceof File) || file.size === 0) {
    redirect(mediaRedirect({ folder, q, error: "Выберите файл для замены" }));
  }

  try {
    await replaceMedia(id, file);
  } catch (error) {
    const message = error instanceof Error ? error.message : "replace";
    redirect(mediaRedirect({ folder, q, error: message }));
  }

  revalidatePath("/admin/media");
  revalidatePath("/", "layout");
  redirect(mediaRedirect({ folder, q, replaced: "1" }));
}

function mediaRedirect(opts: {
  folder?: string;
  q?: string;
  error?: string;
  replaced?: string;
  deleted?: string;
}) {
  const params = new URLSearchParams();
  if (opts.folder) params.set("folder", opts.folder);
  if (opts.q) params.set("q", opts.q);
  if (opts.error) params.set("error", opts.error);
  if (opts.replaced) params.set("replaced", opts.replaced);
  if (opts.deleted) params.set("deleted", opts.deleted);
  const qs = params.toString();
  return qs ? `/admin/media?${qs}` : "/admin/media";
}
