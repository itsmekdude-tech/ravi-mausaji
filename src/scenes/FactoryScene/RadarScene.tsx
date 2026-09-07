import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from '../../theme/palette'
import { RadarFX } from '../fx/PostFX'

interface Props {
  reducedMotion: boolean
  cut: boolean
  onContact: () => void
  onSnipped: () => void
}

const R = 2.2 // radar radius (world units)

/** Stylized islands; index 0 is the smoking trawler (interactive). */
const ISLANDS: Array<[number, number]> = [
  [0.9, 0.4],
  [-1.3, 0.8],
  [-0.6, -1.2],
  [1.4, -0.9],
  [0.2, 1.5],
  [-1.7, -0.3],
  [1.7, 0.6],
  [-0.9, 1.2],
  [0.5, -1.6],
  [-1.5, 1.4],
  [1.1, 1.3],
  [-0.2, -0.7],
  [1.9, -0.2],
  [-0.4, 1.9],
  [0.75, -1.15],
]

export default function RadarScene({ reducedMotion, cut, onContact, onSnipped }: Props) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5], zoom: 88 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scope
        reducedMotion={reducedMotion}
        cut={cut}
        onContact={onContact}
        onSnipped={onSnipped}
      />
      {!reducedMotion && <RadarFX />}
    </Canvas>
  )
}

function Scope({ reducedMotion, cut, onContact, onSnipped }: Props) {
  const sweep = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uAngle: { value: 0 },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(palette.phosphor) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uAngle;
          uniform float uTime;
          uniform vec3 uColor;
          const float TAU = 6.2831853;
          // cheap hash noise
          float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p) * 2.0;
            if (r > 1.0) discard;
            float ang = atan(p.y, p.x);
            float d = mod(uAngle - ang, TAU);
            // long soft afterglow trail with a bright leading edge
            float trail = pow(1.0 - d / TAU, 4.0);
            float lead = smoothstep(0.05, 0.0, d);
            // faint phosphor speckle that decays behind the beam
            float spk = hash(floor(p * 60.0) + floor(uTime * 4.0)) * 0.12 * trail;
            // expanding range-gate ripple
            float ripple = smoothstep(0.02, 0.0, abs(fract(r * 3.0 - uTime * 0.35) - 0.5) - 0.46) * 0.08;
            float glow = clamp(trail * 0.6 + lead + spk + ripple, 0.0, 1.0);
            gl_FragColor = vec4(uColor * (1.0 + lead * 1.5), glow * 0.6 + 0.04);
          }
        `,
      }),
    [],
  )

  useFrame((state, delta) => {
    sweep.uniforms.uTime.value = state.clock.elapsedTime
    sweep.uniforms.uAngle.value = reducedMotion
      ? 2.1
      : sweep.uniforms.uAngle.value - delta * 1.35
  })

  const smoke = ISLANDS[0]

  return (
    <group>
      {/* scope face with a faint radial falloff */}
      <mesh>
        <circleGeometry args={[R, 96]} />
        <meshBasicMaterial color={palette.seaAbyss} />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[R, 96]} />
        <meshBasicMaterial color={palette.seaDeep} transparent opacity={0.6} />
      </mesh>

      {/* range rings */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <mesh key={f}>
          <ringGeometry args={[R * f - 0.007, R * f, 96]} />
          <meshBasicMaterial
            color={palette.phosphorDim}
            transparent
            opacity={0.55}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* crosshair */}
      <mesh>
        <planeGeometry args={[R * 2, 0.005]} />
        <meshBasicMaterial color={palette.phosphorDim} transparent opacity={0.45} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.005, R * 2]} />
        <meshBasicMaterial color={palette.phosphorDim} transparent opacity={0.45} toneMapped={false} />
      </mesh>

      {/* the sweep */}
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[R, 96]} />
        <primitive object={sweep} attach="material" />
      </mesh>

      {ISLANDS.slice(1).map(([x, y], i) => (
        <Blip key={i} x={x} y={y} reducedMotion={reducedMotion} />
      ))}

      <SmokingBlip
        x={smoke[0]}
        y={smoke[1]}
        active={!cut}
        onClick={() => !cut && onContact()}
        reducedMotion={reducedMotion}
      />

      {cut && (
        <PatrolVessel target={smoke} reducedMotion={reducedMotion} onArrive={onSnipped} />
      )}

      {/* brass bezel with an inner highlight */}
      <mesh position={[0, 0, 0.03]}>
        <ringGeometry args={[R, R + 0.09, 96]} />
        <meshBasicMaterial color={palette.brass} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <ringGeometry args={[R + 0.09, R + 0.11, 96]} />
        <meshBasicMaterial color={palette.brassShadow} />
      </mesh>
    </group>
  )
}

function Blip({ x, y, reducedMotion }: { x: number; y: number; reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = reducedMotion
      ? 0.6
      : (Math.sin(state.clock.elapsedTime * 2 + x * 3) + 1) / 2
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + t * 0.6
  })
  return (
    <mesh ref={ref} position={[x, y, 0.05]}>
      <circleGeometry args={[0.05, 20]} />
      <meshBasicMaterial color={palette.phosphor} transparent opacity={0.6} toneMapped={false} />
    </mesh>
  )
}

function SmokingBlip({
  x,
  y,
  active,
  onClick,
  reducedMotion,
}: {
  x: number
  y: number
  active: boolean
  onClick: () => void
  reducedMotion: boolean
}) {
  const ring = useRef<THREE.Mesh>(null)
  const plume = useRef<THREE.Group>(null)
  useFrame((state) => {
    const et = state.clock.elapsedTime
    if (ring.current) {
      const s = reducedMotion ? 1.4 : 1 + ((et * 0.8) % 1) * 1.6
      ring.current.scale.setScalar(s)
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = active
        ? Math.max(0, 0.85 - (s - 1) / 1.6)
        : 0
    }
    // drifting smoke signature
    if (plume.current && !reducedMotion) {
      plume.current.children.forEach((c, i) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial
        const ph = (et * 0.4 + i * 0.33) % 1
        c.position.y = ph * 0.4
        c.position.x = Math.sin(ph * 6 + i) * 0.06
        c.scale.setScalar(0.3 + ph * 0.9)
        m.opacity = active ? (1 - ph) * 0.35 : 0
      })
    }
  })
  return (
    <group position={[x, y, 0.08]}>
      <group
        onClick={onClick}
        onPointerOver={() => {
          if (active) document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <mesh ref={ring}>
          <ringGeometry args={[0.06, 0.095, 28]} />
          <meshBasicMaterial color={palette.sovietRed} transparent opacity={0.85} toneMapped={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.075, 24]} />
          <meshBasicMaterial
            color={active ? palette.sovietRed : palette.phosphorDim}
            toneMapped={false}
          />
        </mesh>
      </group>
      <group ref={plume}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0, -0.01]}>
            <circleGeometry args={[0.05, 12]} />
            <meshBasicMaterial color={palette.sovietRed} transparent opacity={0} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function PatrolVessel({
  target,
  onArrive,
  reducedMotion,
}: {
  target: [number, number]
  onArrive: () => void
  reducedMotion: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  const arrived = useRef(false)
  const netRef = useRef<THREE.Mesh>(null)

  // a small pointed hull outline
  const hull = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.12)
    s.lineTo(0.07, -0.02)
    s.lineTo(0.05, -0.09)
    s.lineTo(-0.05, -0.09)
    s.lineTo(-0.07, -0.02)
    s.closePath()
    return s
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.position
    const tx = target[0] * 0.62
    const ty = target[1] * 0.62
    const lerp = reducedMotion ? 1 : Math.min(1, delta * 1.5)
    pos.x += (tx - pos.x) * lerp
    pos.y += (ty - pos.y) * lerp
    ref.current.rotation.z =
      Math.atan2(target[1] - pos.y, target[0] - pos.x) - Math.PI / 2
    if (Math.hypot(tx - pos.x, ty - pos.y) < 0.05 && !arrived.current) {
      arrived.current = true
      onArrive()
    }
    if (netRef.current) {
      const m = netRef.current.material as THREE.MeshBasicMaterial
      m.opacity = arrived.current ? Math.max(0, m.opacity - delta) : 0.5
    }
  })

  return (
    <group>
      {/* trawl net line, snaps when the boat arrives */}
      <mesh
        ref={netRef}
        position={[target[0] / 2, target[1] / 2, 0.06]}
        rotation={[0, 0, Math.atan2(target[1], target[0])]}
      >
        <planeGeometry args={[Math.hypot(target[0], target[1]), 0.02]} />
        <meshBasicMaterial color={palette.parchment} transparent opacity={0.5} />
      </mesh>
      <group ref={ref} position={[0, 0, 0.12]}>
        <mesh>
          <shapeGeometry args={[hull]} />
          <meshBasicMaterial color={palette.brassHi} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.02, 0.001]}>
          <circleGeometry args={[0.02, 8]} />
          <meshBasicMaterial color={palette.phosphor} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
