import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { palette } from '../../theme/palette'

interface Props {
  /** Scroll progress 0→1 winds the capstan and lifts the fish. */
  progress: number
  reducedMotion: boolean
}

export default function CapstanReel({ progress, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 6.4], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1.5} color={palette.brassHi} />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color={palette.seaFoam} />
      <Rig progress={progress} reducedMotion={reducedMotion} />
    </Canvas>
  )
}

function Rig({ progress, reducedMotion }: Props) {
  const drum = useRef<THREE.Group>(null)
  const water = useRef<THREE.Mesh>(null)
  const fish = useRef<THREE.Group>(null)
  const splash = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    // wind the drum with scroll
    if (drum.current) drum.current.rotation.y = progress * 22

    // fish rises through the second half of the chapter
    if (fish.current) {
      const rise = THREE.MathUtils.clamp((progress - 0.4) / 0.5, 0, 1)
      const eased = rise * rise * (3 - 2 * rise) // smoothstep
      fish.current.position.y = -3.4 + eased * 3.1
      // struggle wobble before it tires
      const struggle = reducedMotion ? 0 : (1 - rise) * 0.25
      fish.current.rotation.z = Math.sin(t * 6) * struggle
      fish.current.position.x = -2.1 + Math.sin(t * 2) * struggle
    }

    // water ripple
    if (water.current && !reducedMotion) {
      water.current.position.y = -1.2 + Math.sin(t * 1.5) * 0.02
    }

    // splash pops when the fish breaks the surface (~progress 0.7)
    if (splash.current) {
      const near = 1 - Math.min(1, Math.abs(progress - 0.7) / 0.08)
      const s = 0.2 + near * 1.4
      splash.current.scale.setScalar(s)
      ;(splash.current.material as THREE.MeshBasicMaterial).opacity = near * 0.7
    }

    void delta
  })

  const wound = Math.floor(progress * 9)

  return (
    <group>
      {/* --- the capstan drum --- */}
      <group ref={drum} position={[1.4, 0, 0]}>
        {/* barrel */}
        <mesh castShadow>
          <cylinderGeometry args={[1, 1.05, 2.1, 40]} />
          <meshStandardMaterial
            color={palette.brass}
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
        {/* end caps */}
        {[1.05, -1.05].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[1.12, 1.12, 0.12, 40]} />
            <meshStandardMaterial color={palette.brassHi} metalness={0.9} roughness={0.25} />
          </mesh>
        ))}
        {/* whelps (vertical ribs) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.12, 2.0, 0.16]} />
              <meshStandardMaterial color={palette.brassShadow} metalness={0.7} roughness={0.4} />
            </mesh>
          )
        })}
        {/* wound rope coils grow as you scroll */}
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh
            key={i}
            position={[0, -0.9 + i * 0.22, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            visible={i < wound}
          >
            <torusGeometry args={[1.06, 0.08, 8, 40]} />
            <meshStandardMaterial color={palette.copperOxide} roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* --- taut rope down to the fish --- */}
      <mesh position={[-0.4, -0.6, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.03, 0.03, 5, 8]} />
        <meshStandardMaterial color={palette.parchment} roughness={0.9} />
      </mesh>

      {/* --- sea surface --- */}
      <mesh ref={water} position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial
          color={palette.sea}
          transparent
          opacity={0.72}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={splash} position={[-2.1, -1.15, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.34, 24]} />
        <meshBasicMaterial color={palette.seaFoam} transparent opacity={0} />
      </mesh>

      {/* --- the catch --- */}
      <group ref={fish} position={[-2.1, -3.4, 0.2]}>
        <Fish />
      </group>
    </group>
  )
}

/** A stylized low-poly fish. */
function Fish() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh scale={[1, 1.7, 1]}>
        <sphereGeometry args={[0.5, 16, 12]} />
        <meshStandardMaterial color={palette.seaFoam} metalness={0.4} roughness={0.4} />
      </mesh>
      {/* tail */}
      <mesh position={[0, -0.95, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[0.42, 0.6, 4]} />
        <meshStandardMaterial color={palette.seaShallow} roughness={0.5} />
      </mesh>
      {/* eye */}
      <mesh position={[0.18, 0.62, 0.34]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
    </group>
  )
}
