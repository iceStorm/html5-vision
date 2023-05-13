const textEncoder = new TextDecoder('utf-8')

export function detectBarcodes<T>(callback: (image: ImageData) => T, data: ImageData) {
  return callback(data)
}

export function decodeBarcodeData(data: Int8Array) {
  return textEncoder.decode(data)
}
