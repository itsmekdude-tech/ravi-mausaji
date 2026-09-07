import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from '../../theme/palette'

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
]

export default function RadarScene({ reducedMotion, cut, onContact, onSnipped }: Props) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5], zoom: 90 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scope
        reducedMotion={reducedMotion}
        cut={cut}
        onContact={onContact}
        onSnipped={onSnipped}
      />
    </Canvas>
  )
}

function Scope({ reducedMotion, cut, onContact, onSnipped }: Props) {
  const sweep = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uAngle: { value: 0 },
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
          uniform vec3 uColor;
          const float TAU = 6.2831853;
          void main() {
            vec2 p = vUv - 0.5;
            float r = length(p) * 2.0;
            if (r > 1.0) discard;
            float ang = atan(p.y, p.x);
            float d = mod(uAngle - ang, TAU);
            float trail = pow(1.0 - d / TAU, 3.5);
            float lead = smoothstep(0.06, 0.0, d) * 0.8;
            float glow = clamp(trail + lead, 0.0, 1.0);
            gl_FragColor = vec4(uColor, glow * 0.55 + 0.05);
          }
        `,
      }),
    [],
  )

  useFrame((_, delta) => {
    sweep.uniforms.uAngle.value = reducedMotion
      ? 2.1
      : sweep.uniforms.uAngle.value - delta * 1.4
  })

  const smoke = ISLANDS[0]

  return (
    <group>
      <mesh>
        <circleGeometry args={[R, 64]} />
        <meshBasicMaterial color={palette.seaDeep} />
      </mesh>

      {[0.25, 0.5, 0.75, 1].map((f) => (
        <mesh key={f}>
          <ringGeometry args={[R * f - 0.008, R * f, 64]} />
          <meshBasicMaterial color={palette.phosphorDim} transparent opacity={0.5} />
        </mesh>
      ))}
      <mesh>
        <planeGeometry args={[R * 2, 0.006]} />
        <meshBasicMaterial color={palette.phosphorDim} transparent opacity={0.4} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.006, R * 2]} />
        <meshBasicMaterial color={palette.phosphorDim} transparent opacity={0.4} />
      </mesh>

      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[R, 64]} />
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

      <mesh>
        <ringGeometry args={[R, R + 0.08, 64]} />
        <meshBasicMaterial color={palette.brass} />
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
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + t * 0.5
  })
  return (
    <mesh ref={ref} position={[x, y, 0.05]}>
      <circleGeometry args={[0.045, 16]} />
      <meshBasicMaterial color={palette.phosphor} transparent opacity={0.6} />
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
  useFrame((state) => {
    if (!ring.current) return
    const s = reducedMotion ? 1.4 : 1 + ((state.clock.elapsedTime * 0.8) % 1) * 1.4
    ring.current.scale.setScalar(s)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = active
      ? Math.max(0, 0.8 - (s - 1) / 1.4)
      : 0
  })
  return (
    <group
      position={[x, y, 0.08]}
      onClick={onClick}
      onPointerOver={() => {
        if (active) document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <mesh ref={ring}>
        <ringGeometry args={[0.06, 0.09, 24]} />
        <meshBasicMaterial color={palette.sovietRed} transparent opacity={0.8} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.07, 20]} />
        <meshBasicMaterial color={active ? palette.sovietRed : palette.phosphorDim} />
      </mesh>
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

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.position
    const tx = target[0] * 0.6
    const ty = target[1] * 0.6
    const lerp = reducedMotion ? 1 : Math.min(1, delta * 1.6)
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
      m.opacity = arrived.current ? Math.max(0, m.opacity - delta) : 0.55
    }
  })

  return (
    <group>
      <mesh
        ref={netRef}
        position={[target[0] / 2, target[1] / 2, 0.06]}
        rotation={[0, 0, Math.atan2(target[1], target[0])]}
      >
        <planeGeometry args={[Math.hypot(target[0], target[1]), 0.02]} />
        <meshBasicMaterial color={palette.parchment} transparent opacity={0.55} />
      </mesh>
      <group ref={ref} position={[0, 0, 0.12]}>
        <mesh>
          <coneGeometry args={[0.07, 0.18, 3]} />
          <meshBasicMaterial color={palette.brassHi} />
        </mesh>
      </group>
    </group>
  )
}
