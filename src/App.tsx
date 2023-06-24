import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import { Cyberspace } from './components/ThreeCyberspace'
import { Construct } from './components/ThreeConstruct'
import './App.css'
import { decodeHexToCoordinates, emptyHex256 } from './libraries/Constructs'

function App() {

  const [scale] = useState(2**50)
  const [size, setSize] = useState(1)
  const [coord, setCoord] = useState(decodeHexToCoordinates(emptyHex256))

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const coordParam = urlParams.get('hash') || emptyHex256
    setCoord(decodeHexToCoordinates(coordParam))
    const sizeParam = urlParams.get('size') || ""
    setSize(parseInt(sizeParam) || 1)
  }, [])

  return (
    <div className="cyberspace-viewer">
      <Canvas style={{height: "100vh"}} camera={{
        near: 0.001, 
        far: scale*2*2*2*2*2*2*2*2,
        position: [0, 0, scale]
      }}>
        <ambientLight intensity={0.8} />
        <Cyberspace scale={scale}>
          <Construct coord={coord} size={size}/>
        </Cyberspace>
        <OrbitControls/>
      </Canvas>
    </div>
  )
}

export default App
