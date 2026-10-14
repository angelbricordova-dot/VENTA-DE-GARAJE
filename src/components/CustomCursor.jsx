import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: -300, y: -300 })
  const smooth  = useRef({ x: -300, y: -300 })
  const raf     = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor-active')

    const move = ({ clientX: x, clientY: y }) => {
      mouse.current = { x, y }
      if (dotRef.current) {
        dotRef.current.style.left = x + 'px'
        dotRef.current.style.top  = y + 'px'
      }
    }

    const over = ({ target }) => {
      const interactive = target.closest('a, button, [role="button"], input, select, textarea, label')
      ringRef.current?.classList.toggle('is-hovering', !!interactive)
    }

    const down = () => {
      dotRef.current?.classList.add('is-clicking')
      ringRef.current?.classList.add('is-clicking')
    }
    const up = () => {
      dotRef.current?.classList.remove('is-clicking')
      ringRef.current?.classList.remove('is-clicking')
    }

    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.13
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.13
      if (ringRef.current) {
        ringRef.current.style.left = smooth.current.x + 'px'
        ringRef.current.style.top  = smooth.current.y + 'px'
      }
      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup',   up)
    raf.current = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup',   up)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
