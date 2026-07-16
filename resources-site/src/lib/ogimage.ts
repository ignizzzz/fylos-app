/**
 * A tiny, dependency-free raster + PNG encoder, used at build time to produce
 * real bitmap share images. Social crawlers (Facebook, X, LinkedIn) do not
 * reliably render SVG for og:image, so hero and share images are emitted as
 * PNG. These are tasteful brand placeholders; a designer can drop in richer
 * artwork later at the same paths.
 */
import { deflateSync } from 'node:zlib'

type RGB = [number, number, number]

const PALETTE = {
  cream: [251, 247, 242] as RGB,
  paper: [255, 253, 250] as RGB,
  peach: [255, 233, 220] as RGB,
  peach2: [251, 231, 221] as RGB,
  coral: [232, 93, 42] as RGB,
  sage: [124, 146, 113] as RGB,
  ink: [43, 35, 32] as RGB,
  line: [223, 209, 191] as RGB,
  white: [255, 255, 255] as RGB,
}

class Raster {
  readonly width: number
  readonly height: number
  private readonly data: Uint8Array

  constructor(width: number, height: number, bg: RGB) {
    this.width = width
    this.height = height
    this.data = new Uint8Array(width * height * 3)
    for (let i = 0; i < width * height; i++) {
      this.data[i * 3] = bg[0]
      this.data[i * 3 + 1] = bg[1]
      this.data[i * 3 + 2] = bg[2]
    }
  }

  private blend(x: number, y: number, color: RGB, alpha: number): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height || alpha <= 0) return
    const i = (y * this.width + x) * 3
    const a = Math.min(1, alpha)
    this.data[i] = Math.round((this.data[i] as number) * (1 - a) + color[0] * a)
    this.data[i + 1] = Math.round((this.data[i + 1] as number) * (1 - a) + color[1] * a)
    this.data[i + 2] = Math.round((this.data[i + 2] as number) * (1 - a) + color[2] * a)
  }

  fillRect(x0: number, y0: number, w: number, h: number, color: RGB): void {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) this.blend(x, y, color, 1)
    }
  }

  toBuffer(): Buffer {
    return encodePng(this.width, this.height, this.data)
  }
}

// ---- PNG encoding --------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    c = (CRC_TABLE[(c ^ (buf[i] as number)) & 0xff] as number) ^ (c >>> 8)
  }
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type: string, data: Uint8Array): Buffer {
  const typeBytes = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBytes, Buffer.from(data)])
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([length, body, crc])
}

function encodePng(width: number, height: number, rgb: Uint8Array): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: truecolor RGB
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // Filter byte (0 = none) prepended to each scanline.
  const stride = width * 3
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    rgb.subarray(y * stride, (y + 1) * stride).forEach((v, i) => {
      raw[y * (stride + 1) + 1 + i] = v
    })
  }

  const idat = deflateSync(raw, { level: 9 })

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', new Uint8Array(0)),
  ])
}

// ---- brand compositions --------------------------------------------------

export type ShareTheme = 'default' | 'health' | 'safety' | 'neighborhood'

/** Draw a coral square with a cream "F" monogram at (x, y), side length s. */
function drawMonogram(r: Raster, x: number, y: number, s: number, square: RGB, mark: RGB): void {
  const u = s / 512
  const px = (n: number): number => Math.round(n * u)
  r.fillRect(x, y, s, s, square)
  r.fillRect(x + px(170), y + px(140), px(60), px(232), mark) // stem
  r.fillRect(x + px(170), y + px(140), px(190), px(56), mark) // top bar
  r.fillRect(x + px(170), y + px(238), px(150), px(52), mark) // middle bar
}

/**
 * An editorial share card: warm paper, a thin ruled frame, the FYLOS monogram,
 * and one quiet accent bar whose color hints at the theme. No abstract blobs.
 * These appear only in social previews, never in the page itself.
 */
export function brandCard(theme: ShareTheme): Buffer {
  const W = 1200
  const H = 630
  const p = PALETTE
  const r = new Raster(W, H, p.cream)

  // Thin ruled frame.
  const m = 66
  const t = 2
  r.fillRect(m, m, W - 2 * m, t, p.line)
  r.fillRect(m, H - m - t, W - 2 * m, t, p.line)
  r.fillRect(m, m, t, H - 2 * m, p.line)
  r.fillRect(W - m - t, m, t, H - 2 * m, p.line)

  // Monogram, top-left inside the frame.
  drawMonogram(r, 116, 116, 148, p.coral, p.cream)

  // A single accent bar near the bottom-left; color is the only per-theme cue.
  const accent: Record<ShareTheme, RGB> = {
    default: p.coral,
    health: p.sage,
    safety: p.coral,
    neighborhood: p.peach,
  }
  r.fillRect(116, H - 150, 236, 8, accent[theme])
  return r.toBuffer()
}

/** The FYLOS monogram as a standalone logo (coral square, cream "F"). */
export function logoPng(size = 512): Buffer {
  const p = PALETTE
  const r = new Raster(size, size, p.white)
  const inset = Math.round(size * 0.08)
  drawMonogram(r, inset, inset, size - inset * 2, p.coral, p.cream)
  return r.toBuffer()
}
