import React, { useMemo, useRef, useState, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Line } from "three"
import { InverseConstructLineData } from "../data/ConstructLineData.js"
import { OrbitControls } from "@react-three/drei"

const LOGO_TEAL = 0x06a4a4
const LOGO_PURPLE = 0x78004e
const LOGO_BLUE = 0x0062cd

const TealLineMaterial = new THREE.LineBasicMaterial({
  color: LOGO_TEAL,
})
const PurpleLineMaterial = new THREE.LineBasicMaterial({
  color: LOGO_PURPLE,
})

const BlueLineMaterial = new THREE.LineBasicMaterial({
  color: LOGO_BLUE,
})

export const Construct: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [interactionActive, setInteractionActive] = useState(false)
  const [defaultView, setDefaultView] = useState(true)
  const { camera } = useThree()

  const targetPosition = new THREE.Vector3()
  const radius = 14 // The radius of the circular path the camera will follow
  const center = new THREE.Vector3(0, 0, 0) // The center of the object

  // Attach pointerdown and pointerup event listeners
  useEffect(() => {
    const handleInteractionStart = () => {
      setInteractionActive(true)
      setDefaultView(false)
    }
    const handleInteractionEnd = () => {
      setInteractionActive(false)
      setTimeout(() => {
        setDefaultView(true)
      }, 2000)
    }

    window.addEventListener('pointerdown', handleInteractionStart)
    window.addEventListener('pointerup', handleInteractionEnd)

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('pointerdown', handleInteractionStart)
      window.removeEventListener('pointerup', handleInteractionEnd)
    }
  }, [])

  // Compute the lines and grids only once
  const { lines, grids } = useMemo(() => {
    const lines = InverseConstructLineData.map(([start, end]) => {
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      return (
        <primitive
          key={JSON.stringify({ start, end })}
          object={new Line(geometry, TealLineMaterial)}
        />
      )
    })

    const gridSize = 8
    const gridSegments = 1
    const grids = [
      <gridHelper
        key="y+"
        args={[gridSize, gridSegments]}
        position={[0, gridSize / 2, 0]}
        material={PurpleLineMaterial}
      />,
      <gridHelper
        key="x+"
        args={[gridSize, gridSegments]}
        position={[gridSize/2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={PurpleLineMaterial}
      />,
      <gridHelper
        key="z+"
        args={[gridSize, gridSegments]}
        position={[0, 0, gridSize / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        material={PurpleLineMaterial}
      />,
      <gridHelper
        key="y-"
        args={[gridSize, gridSegments]}
        position={[0, -gridSize / 2, 0]}
        material={PurpleLineMaterial}
      />,
      <gridHelper
        key="x-"
        args={[gridSize, gridSegments]}
        position={[-gridSize/2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={PurpleLineMaterial}
      />,
      <gridHelper
        key="z-"
        args={[gridSize, gridSegments]}
        position={[0, 0, -gridSize / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        material={PurpleLineMaterial}
      />,
    ]

    return { lines, grids }
  }, [])
  
  // camera.position.x = center.x - radius * Math.sin(Math.PI/4)
  // camera.position.z = center.z - radius * Math.cos(Math.PI/8)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // groupRef.current.scale.set(scale, scale, scale)
      // groupRef.current.rotation.y += 0.005
    }
    const angle = clock.elapsedTime * 0.2 // Controls the speed of rotation
    if (defaultView) {
      targetPosition.set(
        center.x + radius * Math.sin(angle),
        center.y,
        center.z + radius * Math.cos(angle)
      )
      camera.position.lerp(targetPosition, 0.05)
      camera.lookAt(center)
    }
  })

  return (
    <group ref={groupRef}>
      {lines}
      {grids}
    </group>
  )
}

export default Construct
