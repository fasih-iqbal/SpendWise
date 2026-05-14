import sharp from 'sharp'

const sizes = [192, 512]

function svgIcon(size) {
  const r = Math.round(size * 0.22)
  const fs = Math.round(size * 0.52)
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#5B6EF5"/>
          <stop offset="100%" stop-color="#2DD4BF"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="url(#g)"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size*0.32}" fill="rgba(255,255,255,0.15)"/>
      <text x="${size/2}" y="${size*0.58}" dominant-baseline="middle" text-anchor="middle" font-size="${fs}" font-family="Arial, sans-serif" fill="white" font-weight="bold">S</text>
    </svg>`
  )
}

await Promise.all(
  sizes.map(size =>
    sharp(svgIcon(size))
      .png()
      .toFile(`public/icons/icon-${size}.png`)
  )
)

console.log('Icons generated successfully')
