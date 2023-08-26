import React, { useMemo, useRef, useState, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { BigCoords, downscaleCoords } from "../libraries/Constructs.js"
import { UNIVERSE_SIZE_HALF, UNIVERSE_DOWNSCALE, UNIVERSE_SIZE } from "../libraries/Cyberspace.js"
import { invert } from "three/examples/jsm/nodes/Nodes.js"

const INTERACTION_RESET_DELAY = 1//5_000

// const LOGO_TEAL = 0x06a4a4
const LOGO_PURPLE = 0x78004e
const LOGO_BLUE = 0x0062cd

// const TealLineMaterial = new THREE.LineBasicMaterial({
//   color: LOGO_TEAL,
// })
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
  targetSize: number, // size of construct to determine camera orbit radius
  targetCoord: BigCoords, // for camera orbit
  children: React.ReactNode,
}

const centerVec = new THREE.Vector3(UNIVERSE_SIZE_HALF, UNIVERSE_SIZE_HALF, UNIVERSE_SIZE_HALF) // The center of cyberspace

export const Cyberspace: React.FC<CyberspaceProps> = ({ targetSize, targetCoord, children }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [interactionActive, setInteractionActive] = useState(false)
  const [defaultView, setDefaultView] = useState(true)
  const defaultViewTimeoutRef = useRef<NodeJS.Timeout|undefined>(undefined)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [lerpAlpha, setLerpAlpha] = useState(1)
  const { camera } = useThree()

  const targetPosition = centerVec
  const downscaledTargetCoord = downscaleCoords(targetCoord, UNIVERSE_DOWNSCALE)
  // const radius = targetSize * 10 // The radius of the circular path the camera will follow

const minSize = 1
const maxSize = 2**50/256/256

// const ratio = ( targetSize + (maxSize * 0.1)) / maxSize
const ratio = targetSize / maxSize

// const radius = 100 * Math.pow(targetSize, ratio) + targetSize
// const radius = 100 + targetSize * (1 + ratio)
  const invertRatioLimit = Math.max(1-ratio, minSize/maxSize)

  const radius = Math.max(100, targetSize + targetSize * invertRatioLimit)

  // Attach pointerdown and pointerup event listeners
  useEffect(() => {
    const handleInteractionStart = () => {
      setLerpAlpha(0.05) // permanent
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
    const grids = [
      <gridHelper
        key="y+"
        args={[UNIVERSE_SIZE, 32]}
        position={[UNIVERSE_SIZE_HALF, UNIVERSE_SIZE, UNIVERSE_SIZE_HALF]}
        material={BlueLineMaterial}
        renderOrder={1}
      />,
      <gridHelper
        key="y-"
        args={[UNIVERSE_SIZE, 32]}
        position={[UNIVERSE_SIZE_HALF, 0, UNIVERSE_SIZE_HALF]}
        material={PurpleLineMaterial}
        renderOrder={1}
      />,
    ]

    const blacksun = (
      <mesh geometry={new THREE.CircleGeometry(UNIVERSE_SIZE_HALF/2, 64)} material={SunMaterial} position={[UNIVERSE_SIZE_HALF,UNIVERSE_SIZE_HALF,-UNIVERSE_SIZE_HALF]} renderOrder={-1}/>
    )

    return { grids, blacksun }
  }, [])
  
  useFrame(({ clock }) => {
    if (defaultView) {
      if (!clock.running) clock.start()
      const angle = (clock.elapsedTime + elapsedTime) * 0.2 // Controls the speed of rotation
      targetPosition.set(
        downscaledTargetCoord.x + radius * Math.sin(angle),
        downscaledTargetCoord.y + radius/5,
        downscaledTargetCoord.z + radius * Math.cos(angle)
      )
      camera.position.lerp(targetPosition, lerpAlpha)
    } else {
      if (clock.running) {
        setElapsedTime(clock.elapsedTime + elapsedTime)
        clock.stop()
      }
    }
  })

  // if (groupRef.current) {
  //   groupRef.current.scale.set(scale, scale, scale)
  // }

  return (
    <group ref={groupRef}>
      {blacksun}
      {grids}
      {children}
    </group>
  )
}
