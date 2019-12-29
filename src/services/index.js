const isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp2|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)

export const setEvents = {
  'start': isMobile ? 'touchstart' : 'mousedown',
  'move': isMobile ? 'touchmove' : 'mousemove',
  'end': isMobile ? 'touchend' : 'mouseup'
}

export const setProvide = configs => {
  const options = {}

  const define = (name, get) => Object.defineProperty(options, name, { get, enumerable: true })

  configs.forEach(({ name, get }) => define(name, () => get))

  return options
}
