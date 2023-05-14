import { scanImageData } from '@undecaf/zbar-wasm'

export const pureWorker = new Worker(new URL('./worker', import.meta.url), {
  type: 'module',
})

pureWorker.addEventListener('message', async (e: MessageEvent<ImageData>) => {
  console.log('on decode')

  const results = await scanImageData(e.data)
  console.log('results:', results)

  pureWorker.postMessage(results)
})
