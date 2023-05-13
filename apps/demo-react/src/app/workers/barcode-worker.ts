import * as Comlink from 'comlink'
// import { scanImageData } from '@undecaf/zbar-wasm'

const textEncoder = new TextDecoder('utf-8')

export class BarcodeWorker {
  detectBarcodes<T>(callback: (image: ImageData) => T, data: ImageData) {
    return callback(data)
  }

  decodeBarcodeData(data: Int8Array) {
    return textEncoder.decode(data)
  }
}

Comlink.expose(BarcodeWorker)
