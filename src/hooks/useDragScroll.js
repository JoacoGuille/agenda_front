import { useEffect, useRef } from 'react'

function useDragScroll() {
  const refScroll = useRef(null)
  const refArrastre = useRef(false)

  useEffect(() => {
    const el = refScroll.current
    if (!el) return

    let apretado = false
    let inicioX = 0
    let scrollInicio = 0

    const alPointerDown = (evento) => {
      if (evento.pointerType === 'mouse' && evento.button !== 0) return
      apretado = true
      inicioX = evento.clientX
      scrollInicio = el.scrollLeft
      refArrastre.current = false
      el.classList.add('dragging')
    }

    const alPointerMove = (evento) => {
      if (!apretado || evento.pointerType !== 'mouse') return
      const deltaX = evento.clientX - inicioX
      if (Math.abs(deltaX) > 5) {
        refArrastre.current = true
        evento.preventDefault()
        el.scrollLeft = scrollInicio - deltaX
      }
    }

    const alPointerUp = () => {
      apretado = false
      el.classList.remove('dragging')
      setTimeout(() => {
        refArrastre.current = false
      }, 0)
    }

    const alClickCaptura = (evento) => {
      if (refArrastre.current) {
        evento.preventDefault()
        evento.stopPropagation()
        refArrastre.current = false
      }
    }

    el.addEventListener('pointerdown', alPointerDown)
    el.addEventListener('pointermove', alPointerMove)
    el.addEventListener('pointerup', alPointerUp)
    el.addEventListener('pointerleave', alPointerUp)
    el.addEventListener('pointercancel', alPointerUp)
    el.addEventListener('click', alClickCaptura, true)

    return () => {
      el.removeEventListener('pointerdown', alPointerDown)
      el.removeEventListener('pointermove', alPointerMove)
      el.removeEventListener('pointerup', alPointerUp)
      el.removeEventListener('pointerleave', alPointerUp)
      el.removeEventListener('pointercancel', alPointerUp)
      el.removeEventListener('click', alClickCaptura, true)
    }
  }, [])

  return refScroll
}

export default useDragScroll