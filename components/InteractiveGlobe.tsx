'use client'

import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'
import { useTheme } from 'next-themes'
// https://github.com/shuding/cobe

interface PointerPosition {
  x: number
  y: number
}

interface InteractiveGlobeProps {
  width?: string
  maxWidth?: string
  paddingY?: string
}

export default function InteractiveGlobe({
  width = '80vw',
  maxWidth = '600px',
  paddingY = '1rem',
}: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null)
  const { theme } = useTheme()

  // Add these refs for drag interaction
  const pointerInteracting = useRef<PointerPosition | null>(null)
  const pointerInteractionMovementX = useRef(0)
  const pointerInteractionMovementY = useRef(0)

  // Add spring state for both rotations
  const [{ r, t }, api] = useSpring(() => ({
    r: 0, // horizontal rotation
    t: 0, // vertical rotation
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }))

  useEffect(() => {
    let phi = 0
    const container = containerRef.current
    if (!container) return

    const createGlobeInstance = () => {
      if (globeRef.current) {
        globeRef.current.destroy()
      }

      const globeSize = container.clientWidth
      const mapSamples = window.innerWidth < 768 ? 2000 : 4000

      globeRef.current = createGlobe(canvasRef.current as HTMLCanvasElement, {
        devicePixelRatio: 2,
        width: globeSize * 2,
        height: globeSize * 2,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.2,
        mapSamples,
        mapBrightness: window.innerWidth < 768 ? 4 : 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [0.1, 0.8, 1],
        glowColor: theme === 'dark' ? [0.2, 0.2, 0.2] : [1, 1, 1],
        markers: [],
        onRender: (state) => {
          if (!pointerInteracting.current) {
            phi -= 0.002
          }
          state.phi = phi + r.get()
          state.theta = t.get()
        },
      })
    }

    createGlobeInstance()

    // Fade in the globe
    if (canvasRef.current) {
      canvasRef.current.style.opacity = '0'
      setTimeout(() => {
        if (canvasRef.current) canvasRef.current.style.opacity = '1'
      })
    }

    const resizeObserver = new ResizeObserver(() => {
      // Wrap the call in requestAnimationFrame to prevent the loop
      window.requestAnimationFrame(() => {
        createGlobeInstance()
      })
    })

    resizeObserver.observe(container)

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy()
      }
      resizeObserver.disconnect()
    }
  }, [r, t, theme])

  return (
    <div
      className="relative flex w-full flex-row items-center justify-center"
      style={{ paddingTop: paddingY, paddingBottom: paddingY }}
    >
      <div className="relative mx-auto w-full overflow-hidden">
        <div
          ref={containerRef}
          className="relative mx-auto aspect-square md:w-[80vw]"
          style={{
            width: width,
            maxWidth: maxWidth,
          }}
        >
          <canvas
            ref={canvasRef}
            className="aspect-square h-full w-full cursor-grab transition-opacity duration-1000"
            onPointerDown={(e) => {
              pointerInteracting.current = {
                x: e.clientX - pointerInteractionMovementX.current,
                y: e.clientY - pointerInteractionMovementY.current,
              }
              if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
            }}
            onPointerUp={() => {
              pointerInteracting.current = null
              if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
            }}
            onPointerOut={() => {
              pointerInteracting.current = null
              if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
            }}
            onMouseMove={(e) => {
              if (pointerInteracting.current !== null) {
                const deltaX = e.clientX - pointerInteracting.current.x
                const deltaY = e.clientY - pointerInteracting.current.y
                pointerInteractionMovementX.current = deltaX
                pointerInteractionMovementY.current = deltaY
                api.start({
                  r: deltaX / 200,
                  t: deltaY / 200,
                })
              }
            }}
            onTouchMove={(e) => {
              if (pointerInteracting.current !== null && e.touches[0]) {
                const deltaX = e.touches[0].clientX - pointerInteracting.current.x
                const deltaY = e.touches[0].clientY - pointerInteracting.current.y
                pointerInteractionMovementX.current = deltaX
                pointerInteractionMovementY.current = deltaY
                api.start({
                  r: deltaX / 100,
                  t: deltaY / 100,
                })
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
