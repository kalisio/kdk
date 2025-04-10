export function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function easeOut (t, linearity = 0.5) {
  return 1 - Math.pow(1 - t, 1 / linearity)
}

export function linear (t, initial = 0, final = 1) {
  return initial + t * final
}

export function cubicBezier (t, x1 = 0.42, y1 = 0, x2 = 0.58, y2 = 1) {
  return (
    (1 - t) * (1 - t) * (1 - t) * y1 +
    3 * (1 - t) * (1 - t) * t * x1 +
    3 * (1 - t) * t * t * x2 +
    t * t * t * y2
  )
}
