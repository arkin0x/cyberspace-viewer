import React, { useMemo, useRef, useState, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Line } from "three"
import { InverseConstructLineData } from "../data/ConstructLineData.js"
import { Operator } from "./ThreeOperator"
import { BigCoords } from "../libraries/Constructs.js"

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

export const Construct: React.FC<{ coord: BigCoords, size?: number  }> = ({ coord, size = 1 }) => {
  const groupRef = useRef<THREE.Group>(null)

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

  return (
    <>
    <group ref={groupRef} scale={[size, size, size]} position={[coord.X, coord.Y, coord.Z]} renderOrder={2}>
      {lines}
      {grids}
      <Operator position={[-size*4 -1, 0, size*4 +1]}/>
    </group>
    </>
  )
}
