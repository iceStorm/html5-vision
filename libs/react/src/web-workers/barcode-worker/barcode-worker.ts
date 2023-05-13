import * as Comlink from 'comlink'

export async function runJobInWorker<T>(callback: () => T) {
  return callback()
}

Comlink.expose(runJobInWorker)
