import React, { useMemo, useRef, useState, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { BigCoords } from "../libraries/Constructs.js"

export const CYBERSPACE_SIZE = BigInt(2**85)
export const UNIVERSE_DOWNSCALE = BigInt(2**35)
export const UNIVERSE_SIZE = Number(CYBERSPACE_SIZE / UNIVERSE_DOWNSCALE)
export const UNIVERSE_SIZE_HALF = UNIVERSE_SIZE / 2

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

interface CyberspaceProps {
  scale: number,
  coord: BigCoords,
  children: React.ReactNode,
}

const centerVec = new THREE.Vector3(UNIVERSE_SIZE_HALF, UNIVERSE_SIZE_HALF, UNIVERSE_SIZE_HALF) // The center of cyberspace

export const Cyberspace: React.FC<CyberspaceProps> = ({ scale = 1, coord,  children }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [interactionActive, setInteractionActive] = useState(false)
  const [defaultView, setDefaultView] = useState(true)
  const defaultViewTimeoutRef = useRef<NodeJS.Timeout|undefined>(undefined)
  const [elapsedTime, setElapsedTime] = useState(0)
  const { camera } = useThree()

  const targetPosition = centerVec
  const radius = UNIVERSE_SIZE_HALF // The radius of the circular path the camera will follow

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
    window.addEventListener('wheel', handleInteractionStart)

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('pointerdown', handleInteractionStart)
      window.removeEventListener('pointerup', handleInteractionEnd)
      window.addEventListener('wheel', handleInteractionStart)
    }
  }, [])

  // Compute the lines and grids only once
  const { grids, blacksun } = useMemo(() => {
    const gridSize = 1
    const grids = [
      <gridHelper
        key="y+"
        args={[gridSize, 32]}
        position={[0, gridSize / 2, 0]}
        material={BlueLineMaterial}
        renderOrder={1}
      />,
      <gridHelper
        key="y-"
        args={[gridSize, 32]}
        position={[0, -gridSize / 2, 0]}
        material={PurpleLineMaterial}
        renderOrder={1}
      />,
    ]

    const blacksun = (
      <mesh geometry={new THREE.CircleGeometry(scale, 64)} material={SunMaterial} position={[0,0,-scale*2*2]} renderOrder={-1}/>
    )

    return { grids, blacksun }
  }, [scale])
  
  useFrame(({ clock }) => {
    // camera.lookAt(new THREE.Vector3(coord.x, coord.y, coord.z))
    if (defaultView) {
      if (!clock.running) clock.start()
      const angle = (clock.elapsedTime + elapsedTime) * 0.2 // Controls the speed of rotation
      targetPosition.set(
        coord.x + radius * Math.sin(angle),
        coord.y + scale/5,
        coord.z + radius * Math.cos(angle)
      )
      camera.position.lerp(targetPosition, 0.05)
    } else {
      if (clock.running) {
        setElapsedTime(clock.elapsedTime + elapsedTime)
        clock.stop()
      }
    }
  })

  console.log('gridRef', gridRef.current)
  if (groupRef.current) {
    groupRef.current.scale.set(scale, scale, scale)
  }

  return (
    <>
    <group ref={groupRef}>
      {blacksun}
      {grids}
    </group>
      {children}
    </>
  )
}
