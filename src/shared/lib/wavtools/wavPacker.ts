/**
 * Describes the structure of a WAV audio file
 */
export interface WavPackerAudioType {
  blob: Blob
  url: string
  channelCount: number
  sampleRate: number
  duration: number
}

/**
 * Utility class for packing PCM16 data into "audio/wav" format
 */
export class WavPacker {
  /**
   * Converts a Float32Array of amplitudes to an ArrayBuffer in Int16Array format
   * @param float32Array - array of amplitudes
   * @returns ArrayBuffer
   */
  static floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
    const buffer = new ArrayBuffer(float32Array.length * 2)
    const view = new DataView(buffer)
    let offset = 0

    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
    return buffer
  }

  /**
   * Merges two ArrayBuffers into one
   * @param leftBuffer - first buffer
   * @param rightBuffer - second buffer
   * @returns ArrayBuffer
   */
  static mergeBuffers(leftBuffer: ArrayBuffer = new ArrayBuffer(0), rightBuffer: ArrayBuffer = new ArrayBuffer(0)): ArrayBuffer {
    // NOTICE: left or right buffers could be undefined and throw error

    const tmpArray = new Uint8Array(leftBuffer.byteLength + rightBuffer.byteLength)
    tmpArray.set(new Uint8Array(leftBuffer), 0)
    tmpArray.set(new Uint8Array(rightBuffer), leftBuffer.byteLength)
    return tmpArray.buffer
  }

  /**
   * Packs data in Int16 format
   * @private
   * @param size - 0 = 1x Int16, 1 = 2x Int16
   * @param arg - value to pack
   * @returns Uint8Array
   */
  private _packData(size: 0 | 1, arg: number): Uint8Array {
    return [new Uint8Array([arg, arg >> 8]), new Uint8Array([arg, arg >> 8, arg >> 16, arg >> 24])][size]
  }

  /**
   * Packs audio data into "audio/wav" format and returns a WavPackerAudioType object
   * @param sampleRate - audio sample rate
   * @param audio - object with audio parameters: bit depth, channels, and data
   * @returns WavPackerAudioType
   */
  pack(sampleRate: number, audio: { bitsPerSample: number; channels: Float32Array[]; data: Int16Array }): WavPackerAudioType {
    if (!audio?.bitsPerSample) {
      throw new Error(`Missing "bitsPerSample"`)
    } else if (!audio?.channels) {
      throw new Error(`Missing "channels"`)
    }

    const bufferArray: ArrayBuffer[] = []
    const channelCount = audio.channels.length
    const sampleCount = audio.data.length / channelCount
    const bytesPerSample = audio.bitsPerSample / 8
    const blockAlign = bytesPerSample * channelCount
    const dataChunkSize = sampleCount * blockAlign

    // WAV file header
    bufferArray.push(new TextEncoder().encode("RIFF").buffer)
    bufferArray.push(this._packData(1, 36 + dataChunkSize).buffer)
    bufferArray.push(new TextEncoder().encode("WAVEfmt ").buffer)
    bufferArray.push(this._packData(1, 16).buffer) // Subchunk1Size (16 for PCM)
    bufferArray.push(this._packData(0, 1).buffer) // AudioFormat (1 for PCM)
    bufferArray.push(this._packData(0, channelCount).buffer) // NumChannels
    bufferArray.push(this._packData(1, sampleRate).buffer) // SampleRate
    bufferArray.push(this._packData(1, sampleRate * blockAlign).buffer) // ByteRate
    bufferArray.push(this._packData(0, blockAlign).buffer) // BlockAlign
    bufferArray.push(this._packData(0, audio.bitsPerSample).buffer) // BitsPerSample

    // Data chunk header
    bufferArray.push(new TextEncoder().encode("data").buffer)
    bufferArray.push(this._packData(1, dataChunkSize).buffer)
    bufferArray.push(audio.data.buffer)

    const combinedBuffer = bufferArray.reduce((acc, curr) => WavPacker.mergeBuffers(acc, curr))
    const blob = new Blob([combinedBuffer], { type: "audio/wav" })
    const url = URL.createObjectURL(blob)

    return {
      blob,
      url,
      channelCount,
      sampleRate,
      duration: sampleCount / sampleRate,
    }
  }
}
