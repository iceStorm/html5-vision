import * as Comlink from 'comlink'

import type { BarcodeWorker } from './barcode-worker'

// export const barcodeWorker = new ComlinkWorker<typeof import('./barcode-worker')>(
//   new URL('./barcode-worker', import.meta.url),
// )

export const barcodeWorker = Comlink.wrap<BarcodeWorker>(new Worker('./barcode-worker.ts'))
