import { scanImageData } from '@undecaf/zbar-wasm';

export const add = (a: number, b: number) => a + b;

export const detectBarcodes = (image: ImageData) => {
  return scanImageData(image);
};
