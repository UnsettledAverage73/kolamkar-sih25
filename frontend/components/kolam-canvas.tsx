"use client"

import { useEffect, useRef } from "react"

interface KolamCanvasProps {
  parameters: {
    gridType: string
    rows: number
    columns: number
    dotSpacing: number
    strokeType: string
    symmetryType: string
    iterations: number
  }
  kolamSvg: string | null; // Changed to explicitly allow null
}

export function KolamCanvas({ parameters, kolamSvg }: KolamCanvasProps) {
  if (kolamSvg) {
    return (
      <div
        className="aspect-square bg-white rounded-lg border border-border p-4 flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: kolamSvg }}
      />
    )
  }
  
  // Original canvas rendering logic (kept for fallback or future use if needed)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !parameters) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 400

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid dots
    ctx.fillStyle = "#164e63"
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const spacing = parameters.dotSpacing

    // Draw dots based on grid type
    if (parameters.gridType === "square") {
      for (let i = -parameters.rows / 2; i <= parameters.rows / 2; i++) {
        for (let j = -parameters.columns / 2; j <= parameters.columns / 2; j++) {
          const x = centerX + i * spacing
          const y = centerY + j * spacing
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    }

    // Draw connecting lines based on symmetry
    ctx.strokeStyle = "#164e63"
    ctx.lineWidth = parameters.strokeType === "thick" ? 3 : 2

    if (parameters.strokeType === "dashed") {
      ctx.setLineDash([5, 5])
    } else if (parameters.strokeType === "dotted") {
      ctx.setLineDash([2, 3])
    } else {
      ctx.setLineDash([])
    }

    // Simple pattern generation based on symmetry type
    const drawPattern = () => {
      ctx.beginPath()

      if (parameters.symmetryType === "4-fold") {
        // Draw a simple 4-fold symmetric pattern
        const radius = (Math.min(parameters.rows, parameters.columns) * spacing) / 3

        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2
          const x1 = centerX + Math.cos(angle) * radius
          const y1 = centerY + Math.sin(angle) * radius
          const x2 = centerX + Math.cos(angle + Math.PI / 2) * radius
          const y2 = centerY + Math.sin(angle + Math.PI / 2) * radius

          ctx.moveTo(centerX, centerY)
          ctx.lineTo(x1, y1)
          ctx.lineTo(x2, y2)
        }
      } else if (parameters.symmetryType === "radial") {
        // Draw radial pattern
        const radius = (Math.min(parameters.rows, parameters.columns) * spacing) / 3
        const spokes = 8

        for (let i = 0; i < spokes; i++) {
          const angle = (i * 2 * Math.PI) / spokes
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          ctx.moveTo(centerX, centerY)
          ctx.lineTo(x, y)
        }

        // Add concentric circles
        for (let r = spacing; r <= radius; r += spacing) {
          ctx.moveTo(centerX + r, centerY)
          ctx.arc(centerX, centerY, r, 0, 2 * Math.PI)
        }
      } else {
        // Default simple pattern
        const size = (Math.min(parameters.rows, parameters.columns) * spacing) / 4
        ctx.rect(centerX - size, centerY - size, size * 2, size * 2)
        ctx.moveTo(centerX - size, centerY - size)
        ctx.lineTo(centerX + size, centerY + size)
        ctx.moveTo(centerX + size, centerY - size)
        ctx.lineTo(centerX - size, centerY + size)
      }

      ctx.stroke()
    }

    // Draw pattern with iterations
    for (let i = 0; i < parameters.iterations; i++) {
      ctx.save()
      ctx.globalAlpha = 1 - i * 0.2
      drawPattern()
      ctx.restore()
    }
  }, [parameters])

  return (
    <div className="aspect-square bg-white rounded-lg border border-border p-4">
      <canvas ref={canvasRef} className="w-full h-full" style={{ maxWidth: "100%", height: "auto" }} />
    </div>
  )
}
