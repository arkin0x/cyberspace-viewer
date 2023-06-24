import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import { Cyberspace } from './components/ThreeCyberspace'
import './App.css'

function App() {

  const [size, setSize] = useState(2**50)
  const [coord, setCoord] = useState("0000000000000000000000000000000000000000000000000000000000000000")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const coordParam = urlParams.get('hash') || ""
    setCoord(coordParam)
  }, [])

  return (
    <div className="cyberspace-viewer">
      <Canvas style={{height: "100vh"}} camera={{
        near: 0.001, 
        far: size*2*2*2*2*2*2*2*2,
        position: [0, 0, size]
      }}>
        <ambientLight intensity={0.8} />
        <Cyberspace scale={size}/>
        <OrbitControls/>
      </Canvas>
    </div>
  )
}

export default App
