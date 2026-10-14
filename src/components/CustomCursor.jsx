import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const wrapRef = useRef(null)
  const mouse   = useRef({ x: -300, y: -300 })
  const smooth  = useRef({ x: -300, y: -300 })
  const raf     = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.documentElement.classList.add('custom-cursor-active')

    const move = ({ clientX: x, clientY: y }) => {
      mouse.current = { x, y }
    }

    const over = ({ target }) => {
      const onProduct     = !!target.closest('.card')
      const onInteractive = !!target.closest('a, button, [role="button"]') && !onProduct
      wrapRef.current?.classList.toggle('on-product',     onProduct)
      wrapRef.current?.classList.toggle('on-interactive', onInteractive)
    }

    const down = () => wrapRef.current?.classList.add('is-clicking')
    const up   = () => wrapRef.current?.classList.remove('is-clicking')

    const tick = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.75
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.75
      if (wrapRef.current) {
        wrapRef.current.style.left = smooth.current.x + 'px'
        wrapRef.current.style.top  = smooth.current.y + 'px'
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
    <div ref={wrapRef} className="cursor-wrap" aria-hidden="true">
      <svg className="cursor-arrow" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.5 1.5 L2.5 19 L6.5 14.5 L9.5 22 L12 21 L9 13.5 L15.5 13.5 Z"
          fill="white"
          stroke="#1C1C1E"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <span className="cursor-label">✨ ¡Lo quiero!</span>
    </div>
  )
}
