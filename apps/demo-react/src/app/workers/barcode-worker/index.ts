export const barcodeWorker = new ComlinkWorker<typeof import('./barcode-worker')>(
  new URL('./barcode-worker', import.meta.url),
)
