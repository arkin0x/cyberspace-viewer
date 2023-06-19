import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import { Construct } from './components/ThreeConstruct'
import './App.css'

/**
 * Scale the object based on the size GET parameter
 * @param GET type: "construct" | "homecoord" // @todo 
 * @param GET size: integer. Always divided by 8 because the geometry def is only integers and didn't want to use floats.
 */
function App() {

  const [size, setSize] = useState(1)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sizeParam = urlParams.get('size') || ""
    const size = parseInt(sizeParam) || 1 // Default to 1 if sizeParam is not a valid number
    setSize(size)
  }, [])

  return (
    <div className="cyberspace-viewer">
      <Canvas style={{height: "100vh"}} camera={{
        near: 0.001, 
        far: 1000,
        position: [0, 0, 14]
      }}>
        <ambientLight />
        <Construct scale={size/8}/>
        <OrbitControls/>
      </Canvas>
    </div>
  )
}

export default App
