import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { palette } from '../../theme/palette'
import { CapstanFX } from '../fx/PostFX'

interface Props {
  /** Scroll progress 0→1 winds the capstan and lifts the fish. */
  progress: number
  reducedMotion: boolean
}

export default function CapstanReel({ progress, reducedMotion }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 6.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} color={palette.brassHi} />
      <directionalLight position={[-4, 2, -2]} intensity={0.5} color={palette.seaFoam} />

      {/* procedural image-based lighting — brass reflections, no HDR file */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color={palette.brassHi} position={[3, 4, 3]} scale={[5, 5, 1]} />
        <Lightformer form="rect" intensity={1.1} color={palette.seaFoam} position={[-5, 2, -2]} scale={[6, 6, 1]} />
        <Lightformer form="ring" intensity={1.6} color={palette.parchmentHi} position={[0, 6, 1]} scale={4} />
        <Lightformer form="rect" intensity={0.6} color={palette.lampGlow} position={[0, -3, 4]} scale={[8, 3, 1]} />
      </Environment>

      <Rig progress={progress} reducedMotion={reducedMotion} />

      <ContactShadows
        position={[1.4, -1.16, 0]}
        opacity={0.55}
        scale={7}
        blur={2.6}
        far={3.2}
        color="#03101a"
      />

      {!reducedMotion && <CapstanFX />}
    </Canvas>
  )
}

function Rig({ progress, reducedMotion }: Props) {
  const drum = useRef<THREE.Group>(null)
  const fish = useRef<THREE.Group>(null)
  const splash = useRef<THREE.Group>(null)
  const ripple = useRef<THREE.ShaderMaterial>(null)

  // fragment-only water ripple overlay (safe, no lighting math)
  const rippleMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(palette.seaFoam) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          void main(){
            vec2 p = vUv * vec2(20.0, 14.0);
            float w = sin(p.x*0.6 + uTime*1.2) * 0.5 + 0.5;
            w *= sin(p.y*0.5 - uTime*0.8) * 0.5 + 0.5;
            float lines = smoothstep(0.7, 1.0, w);
            float edgeFade = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
            gl_FragColor = vec4(uColor, lines * 0.10 * edgeFade);
          }
        `,
      }),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (drum.current) drum.current.rotation.y = progress * 22
    if (ripple.current) ripple.current.uniforms.uTime.value = reducedMotion ? 0 : t

    const rise = THREE.MathUtils.clamp((progress - 0.4) / 0.5, 0, 1)
    if (fish.current) {
      const eased = rise * rise * (3 - 2 * rise)
      fish.current.position.y = -3.4 + eased * 3.1
      const struggle = reducedMotion ? 0 : (1 - rise) * 0.28
      fish.current.rotation.z = Math.sin(t * 6) * struggle
      fish.current.position.x = -2.1 + Math.sin(t * 2) * struggle
    }

    // splash droplets arc up around the breakthrough moment (~0.7)
    if (splash.current) {
      const near = 1 - Math.min(1, Math.abs(progress - 0.72) / 0.12)
      splash.current.children.forEach((c, i) => {
        const mesh = c as THREE.Mesh
        const seed = i * 1.7
        const ph = reducedMotion ? 0.5 : (t * 1.3 + seed) % 1
        const ang = seed * 2.4
        mesh.position.set(
          -2.1 + Math.cos(ang) * (0.15 + ph * 0.5),
          -1.15 + ph * (0.7 + (i % 3) * 0.2) - ph * ph * 0.9,
          0.2 + Math.sin(ang) * 0.3,
        )
        const s = (0.03 + (i % 3) * 0.015) * near
        mesh.scale.setScalar(s * (1 - ph * 0.4))
        ;(mesh.material as THREE.MeshStandardMaterial).opacity = near * (1 - ph)
      })
    }
    void delta
  })

  const wound = Math.floor(progress * 9)

  return (
    <group>
      {/* --- the capstan drum --- */}
      <group ref={drum} position={[1.4, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[1, 1.05, 2.1, 48]} />
          <meshStandardMaterial color={palette.brass} metalness={1} roughness={0.24} envMapIntensity={1.2} />
        </mesh>
        {[1.05, -1.05].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[1.14, 1.14, 0.14, 48]} />
            <meshStandardMaterial color={palette.brassHi} metalness={1} roughness={0.18} envMapIntensity={1.4} />
          </mesh>
        ))}
        {/* whelps (vertical ribs) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.12, 2.0, 0.16]} />
              <meshStandardMaterial color={palette.brassShadow} metalness={0.9} roughness={0.45} envMapIntensity={0.9} />
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
            <torusGeometry args={[1.07, 0.085, 10, 44]} />
            <meshStandardMaterial color={palette.copperOxide} roughness={0.75} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* --- taut rope down to the fish --- */}
      <mesh position={[-0.4, -0.6, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.024, 0.036, 5, 10]} />
        <meshStandardMaterial color={palette.parchment} roughness={0.95} metalness={0} />
      </mesh>

      {/* --- sea surface: reflective base + ripple overlay --- */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial
          color={palette.sea}
          transparent
          opacity={0.82}
          metalness={0.6}
          roughness={0.18}
          envMapIntensity={1}
        />
      </mesh>
      <mesh position={[0, -1.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <primitive object={rippleMat} attach="material" ref={ripple} />
      </mesh>

      {/* foam ring at breakthrough */}
      <FoamRing progress={progress} />

      {/* splash droplets */}
      <group ref={splash}>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color={palette.seaFoam} transparent opacity={0} roughness={0.2} metalness={0.1} />
          </mesh>
        ))}
      </group>

      {/* --- the catch --- */}
      <group ref={fish} position={[-2.1, -3.4, 0.2]}>
        <Fish />
      </group>
    </group>
  )
}

function FoamRing({ progress }: { progress: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (!ref.current) return
    const near = 1 - Math.min(1, Math.abs(progress - 0.7) / 0.1)
    ref.current.scale.setScalar(0.3 + near * 1.6)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = near * 0.7
  })
  return (
    <mesh ref={ref} position={[-2.1, -1.14, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.2, 0.34, 32]} />
      <meshBasicMaterial color={palette.seaFoam} transparent opacity={0} toneMapped={false} />
    </mesh>
  )
}

/** A stylized fish with a wet sheen and fins. */
function Fish() {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      {/* body */}
      <mesh scale={[1, 1.7, 0.85]}>
        <sphereGeometry args={[0.5, 32, 24]} />
        <meshPhysicalMaterial
          color={palette.seaFoam}
          metalness={0.35}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.2}
          envMapIntensity={1.1}
        />
      </mesh>
      {/* tail fin */}
      <mesh position={[0, -0.98, 0]}>
        <coneGeometry args={[0.44, 0.62, 5]} />
        <meshPhysicalMaterial color={palette.seaShallow} roughness={0.4} clearcoat={0.6} />
      </mesh>
      {/* dorsal fin */}
      <mesh position={[0, 0.1, 0.4]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[0.16, 0.5, 4]} />
        <meshPhysicalMaterial color={palette.seaShallow} roughness={0.4} clearcoat={0.6} />
      </mesh>
      {/* eye */}
      <mesh position={[0.2, 0.64, 0.32]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={palette.parchmentHi} roughness={0.3} />
      </mesh>
      <mesh position={[0.24, 0.66, 0.37]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshBasicMaterial color={palette.ink} />
      </mesh>
    </group>
  )
}
