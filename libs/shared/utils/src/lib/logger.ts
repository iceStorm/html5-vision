export function log(...message: unknown[]) {
  console.log('[html5-vision]', ...getFormattedMessage(message))
}

function getFormattedMessage(...message: unknown[]): Array<unknown> {
  return message.map((message) => {
    if (typeof message === 'string') {
      return message
    }

    return message || JSON.stringify(message)
  })
}
