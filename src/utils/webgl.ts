let cached: boolean | null = null

/** Feature-detect WebGL once; scenes fall back to static art when false. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    cached = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    cached = false
  }
  return cached
}
