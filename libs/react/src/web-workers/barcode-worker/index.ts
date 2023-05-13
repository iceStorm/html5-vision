import * as Comlink from 'comlink'

// const worker = new Worker(new URL('./barcode-worker', import.meta.url))
// export const proxiedWorker = Comlink.proxy<typeof import('./barcode-worker')>(worker)

export const barcodeWorker = new ComlinkWorker<typeof import('./barcode-worker')>(
  new URL('./barcode-worker', import.meta.url),
)

// export const barcodeWorker = Comlink.proxy(worker)

// import { runJobInWorker } from './barcode-worker'

// const barcodeWorker = Comlink.wrap<typeof runJobInWorker>(new Worker('./barcode-worker.ts'))
