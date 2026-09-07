import {
  EffectComposer,
  Bloom,
  Vignette,
  Scanline,
  DepthOfField,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

/**
 * Postprocessing presets for the two hero scenes. Rendered inside each
 * scene's <Canvas>. Only mounted when the scene is active and motion is
 * allowed, so the composer never runs behind a static fallback.
 */

export function RadarFX() {
  return (
    <EffectComposer multisampling={0}>
      {/* phosphor glow — low threshold so the green sweep/blips bloom */}
      <Bloom
        intensity={1.1}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.4}
        mipmapBlur
      />
      {/* CRT scanlines + tube vignette */}
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.6} opacity={0.18} />
      <Vignette eskil={false} offset={0.28} darkness={0.75} />
    </EffectComposer>
  )
}

export function CapstanFX() {
  return (
    <EffectComposer multisampling={4}>
      {/* only bright brass highlights + foam bloom */}
      <Bloom
        intensity={0.55}
        luminanceThreshold={0.68}
        luminanceSmoothing={0.25}
        mipmapBlur
      />
      {/* very gentle focus pull — kept subtle so it can't over-blur */}
      <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={1.4} />
      <Vignette eskil={false} offset={0.32} darkness={0.6} />
    </EffectComposer>
  )
}
