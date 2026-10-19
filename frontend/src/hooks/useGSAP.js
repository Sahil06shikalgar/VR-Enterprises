import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function useGSAP(callback, dependencies) {
  const contextRef = useRef(null)
  const deps = Array.isArray(dependencies) ? dependencies : []

  useLayoutEffect(() => {
    contextRef.current = gsap.context(() => {
      return callback()
    })

    return () => {
      if (contextRef.current) {
        contextRef.current.revert()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return contextRef
}

export function createGSAPContext(scope) {
  return gsap.context(() => {}, scope)
}

export { gsap, ScrollTrigger }