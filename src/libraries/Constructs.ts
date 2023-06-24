function summation(n: number): number {
  if (n < 2) {
    return n
  } else {
    return n + summation(n - 1)
  }
}

export function constructSizeByValidProofOfWork(pow) {
  return Math.floor(Math.pow(summation(pow), pow / 32))
}

export const emptyHex256 = "0000000000000000000000000000000000000000000000000000000000000000"

export type Coords = {
  x: number
  y: number
  z: number
}

// @todo this decoding doesn't work as described in the cyberspace spec. Each most significant bit should divide the space in half.
export function decodeHexToCoordinates(hexString: string, downscale: bigint): Coords {
    // Checking if the input string is a valid 64 character hexadecimal string
    if (!/^([0-9A-Fa-f]{64})$/.test(hexString)) {
        throw new Error("Invalid hexadecimal string.")
    }

    // Initialize the coordinates
    let X = BigInt(0)
    let Y = BigInt(0)
    let Z = BigInt(0)

    // Convert hex string to binary
    const binaryString = BigInt("0x" + hexString).toString(2).padStart(256, '0')

    // Traverse through the binary string
    for (let i = 0; i < 255; i++) {
        switch (i % 3) {
            case 0:
                X = (X << BigInt(1)) | BigInt(binaryString[i])
                break
            case 1:
                Y = (Y << BigInt(1)) | BigInt(binaryString[i])
                break
            case 2:
                Z = (Z << BigInt(1)) | BigInt(binaryString[i])
                break
        }
    }

    return {x: Number(X/downscale), y: Number(Y/downscale), z: Number(Z/downscale)}
}
