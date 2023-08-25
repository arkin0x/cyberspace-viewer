import { expect, test } from "vitest"
import { decodeHexToCoordinates } from "../libraries/Constructs"

// testing with jest
test("decodeHexToCoordinates", () => {
    const hexString = "e000000000000000000000000000000000000000000000000000000000000000"
    const bigCoords = decodeHexToCoordinates(hexString)
    expect(bigCoords.x).toBe(BigInt("19342813113834066795298816"))
    expect(bigCoords.y).toBe(BigInt("19342813113834066795298816"))
    expect(bigCoords.z).toBe(BigInt("19342813113834066795298816"))
    expect(bigCoords.plane).toBe("d-space")
})
