import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, OrbitControls } from "@react-three/drei"
import { Cyberspace } from './components/ThreeCyberspace'
import { UNIVERSE_DOWNSCALE, UNIVERSE_SIZE } from "./libraries/Cyberspace"
import { Construct } from './components/ThreeConstruct'
import './App.css'
import { BigCoords, decodeHexToCoordinates, emptyHex256, downscaleCoords } from './libraries/Constructs'
import * as THREE from 'three'

function App() {

  const [scale] = useState(UNIVERSE_SIZE)
  const [size, setSize] = useState(Math.pow(2,64))
  const [coord, setCoord] = useState<BigCoords>(decodeHexToCoordinates(emptyHex256))

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const coordParam = urlParams.get('coord') || emptyHex256
    setCoord(decodeHexToCoordinates(coordParam))
    const sizeParam = urlParams.get('constructSize') || ""
    setSize(parseInt(sizeParam) || 1)
  }, [])

  const downscaled = downscaleCoords(coord, UNIVERSE_DOWNSCALE)
  const orbitTarget = new THREE.Vector3(downscaled.x, downscaled.y, downscaled.z)

  return (
    <div className="cyberspace-viewer">
      <Canvas style={{height: "100vh"}} camera={{
        near: 0.001, 
        far: scale*2*2*2*2*2*2*2*2,
        position: [0, 0, scale]
      }}>
        <ambientLight intensity={0.8} />
        <Cyberspace targetCoord={coord} targetSize={size}>
          <Construct coord={coord} size={size}/>
        </Cyberspace>
        <OrbitControls target={orbitTarget}/>
      </Canvas>
    </div>
  )
}

export default App
