/**
 * Локальные медиа Maxi-Kamin.
 * Структура: public/images/… и public/videos/…
 */
export const img = {
  hero: "/images/hero.png",
  delivery: "/images/delivery.png",
  montage: "/images/montage.png",

  granite: {
    quarryWide: "/images/granite/quarry/quarry-wide.jpg",
    quarryLoader: "/images/granite/quarry/quarry-loader.jpg",
    quarryAerial: "/images/granite/quarry/quarry-aerial.jpg",
    quarryOverview: "/images/granite/quarry/quarry-overview.jpg",

    workshopPavers: "/images/granite/production/workshop-pavers-pallet.jpg",
    workshopSlabsStack: "/images/granite/production/workshop-slabs-stack.jpg",
    workshopPolished: "/images/granite/production/workshop-polished-slab.jpg",
    yardCurbs: "/images/granite/production/yard-curbs.jpg",
    workshopRack: "/images/granite/production/workshop-slabs-rack.jpg",
    warehouseSteps: "/images/granite/production/warehouse-steps.jpg",

    paverCloseup: "/images/granite/products/paver-closeup.jpg",
    textureSample: "/images/granite/products/texture-rough-smooth.jpg",
    slabPolished: "/images/granite/products/slab-polished.jpg",
    tileSample: "/images/granite/products/tile-sample.jpg",
  },

  // aliases for older imports
  livingWarm: "/images/granite/products/slab-polished.jpg",
  livingModern: "/images/hero.png",
  livingWide: "/images/granite/production/workshop-polished-slab.jpg",
  livingSoft: "/images/granite/products/texture-rough-smooth.jpg",
  kitchen: "/images/granite/products/tile-sample.jpg",
  kitchenWarm: "/images/granite/production/warehouse-steps.jpg",
  kitchenStone: "/images/granite/products/slab-polished.jpg",
  apartment: "/images/hero.png",
  interior: "/images/granite/production/workshop-slabs-rack.jpg",
  interiorDesign: "/images/granite/production/workshop-polished-slab.jpg",
  house: "/images/granite/quarry/quarry-wide.jpg",
  houseAlt: "/images/granite/quarry/quarry-loader.jpg",
  houseYard: "/images/granite/production/yard-curbs.jpg",
  stairs: "/images/granite/production/warehouse-steps.jpg",
  windowsill: "/images/granite/products/tile-sample.jpg",
  tools: "/images/montage.png",
  deliveryAlias: "/images/delivery.png",
} as const;

export const videos = {
  production1: "/videos/production-process-1.mp4",
  production2: "/videos/production-process-2.mp4",
} as const;
