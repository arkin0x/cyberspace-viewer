import React, { useMemo, useRef, useState, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Line } from "three"
import { InverseConstructLineData } from "../data/ConstructLineData.js"
import { Operator } from "./ThreeOperator"

const INTERACTION_RESET_DELAY = 10_000

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

const SunMaterial = new THREE.MeshBasicMaterial({
 color: 0x2b0c40,
 side: THREE.DoubleSide,
})

export const Cyberspace: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [interactionActive, setInteractionActive] = useState(false)
  const [defaultView, setDefaultView] = useState(true)
  const defaultViewTimeoutRef = useRef<number|undefined>(undefined)
  const [elapsedTime, setElapsedTime] = useState(0)
  const { camera } = useThree()

  const targetPosition = new THREE.Vector3()
  const radius = scale*2*2*2*2// The radius of the circular path the camera will follow
  const center = new THREE.Vector3(0, 0, 0) // The center of the object

  // Attach pointerdown and pointerup event listeners
  useEffect(() => {
    const handleInteractionStart = () => {
      clearTimeout(defaultViewTimeoutRef.current)
      setInteractionActive(true)
      setDefaultView(false)
    }
    const handleInteractionEnd = () => {
      setInteractionActive(false)
      defaultViewTimeoutRef.current = setTimeout(() => {
          // LERP camera back to default orbit
          setDefaultView(true)
        }, INTERACTION_RESET_DELAY)
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
  const { lines, grids, blacksun } = useMemo(() => {
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
        args={[gridSize, 256]}
        position={[0, gridSize / 2, 0]}
        material={BlueLineMaterial}
        renderOrder={1}
      />,
      <gridHelper
        key="y-"
        args={[gridSize, 256]}
        position={[0, -gridSize / 2, 0]}
        material={PurpleLineMaterial}
        renderOrder={1}
      />,
    ]

    const blacksun = (
      <mesh geometry={new THREE.CircleGeometry(scale, 64)} material={SunMaterial} position={[0,0,-scale*2*2]}/>
    )

    return { lines, grids, blacksun }
  }, [])
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.scale.set(scale, scale, scale)
    }
    if (defaultView) {
      if (!clock.running) clock.start()
      const angle = (clock.elapsedTime + elapsedTime) * 0.2 // Controls the speed of rotation
      targetPosition.set(
        center.x + radius * Math.sin(angle),
        center.y + scale/5,
        center.z + radius * Math.cos(angle)
      )
      camera.position.lerp(targetPosition, 0.05)
      camera.lookAt(center)
    } else {
      if (clock.running) {
        setElapsedTime(clock.elapsedTime + elapsedTime)
        clock.stop()
      }
    }
  })

  return (
    <>
    <group ref={groupRef}>
      {blacksun}
      {lines}
      {grids}
    </group>
    </>
  )
}