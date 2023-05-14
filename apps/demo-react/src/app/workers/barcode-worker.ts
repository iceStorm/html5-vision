import { scanImageData } from '@undecaf/zbar-wasm'

export const detectZBar = (image: ImageData) => scanImageData(image)
