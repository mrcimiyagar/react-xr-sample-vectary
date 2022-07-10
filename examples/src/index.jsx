import { render } from 'react-dom'
import { useState, useRef, Suspense } from 'react'
import { VRCanvas, Hands, useXR, Interactive, useHitTest, DefaultXRControllers, ARCanvas } from '@react-three/xr'
import { Box, OrbitControls, Text } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function Button(props) {
  const [hover, setHover] = useState(false)
  const [color, setColor] = useState(0x123456)

  return (
    <Interactive onSelect={() => setColor((Math.random() * 0xffffff) | 0)} onHover={() => setHover(true)} onBlur={() => setHover(false)}>
      <Box scale={[1, 1, 1]} args={[0.1, 0.1, 0.1]} {...props}>
        <meshStandardMaterial attach="material" color={color} />
      </Box>
    </Interactive>
  )
}

function PlayerExample() {
  const { player } = useXR()

  useFrame(() => {
    player.rotation.x = player.rotation.y += 0.01
  })

  return null
}

function HitTestExample() {
  const ref = useRef()

  useHitTest((hit) => {
    hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  })

  return <Box ref={ref} args={[0.1, 0.1, 0.1]} />
}

function App() {
  return (
    <ARCanvas sessionInit={{ requiredFeatures: ['hit-test'] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} />
      <Hands
      // modelLeft="/hand-left.gltf"
      // modelRight="/hand-right.gltf"
      />
    <Suspense fallback={null}>
      <Scene />
      <OrbitControls />
    </Suspense>
      <DefaultXRControllers />
      {false && <PlayerExample />}
      {false && <HitTestExample />}
    </ARCanvas>
  )
}

function Scene() {
  const gltf = useLoader(GLTFLoader, './test.gltf')
  return (
    <>
    <primitive object={gltf.scene} />
    </>
  )
}

function Test() {
  return (
    <Canvas>
    <Suspense fallback={null}>
      <Scene />
      <OrbitControls />
    </Suspense>
    </Canvas>
  );
}

render(<App />, document.querySelector('#root'))
