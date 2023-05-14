import { scanImageData } from '@undecaf/zbar-wasm'

const textDecoder = new TextDecoder()

export async function detectZBar(image: ImageData) {
  console.log('detectZBar runs in worker...');
  return await scanImageData(image)
}

export function decodeZbarData(data: Int8Array) {
  return textDecoder.decode(data)
}
