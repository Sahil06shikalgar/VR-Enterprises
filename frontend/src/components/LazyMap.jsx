import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

/*
 * Keyless Google Maps embed that lazy-loads only once it scrolls near the
 * viewport. Shows a lightweight placeholder until the map is present and
 * has finished loading, and never depends on an API key.
 */
function LazyMap({ src, title, loadingLabel = 'Loading map…' }) {
  const frameRef = useRef(null)
  const [nearView, setNearView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame || typeof IntersectionObserver === 'undefined') {
      setNearView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '240px 0px' },
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="map-frame" ref={frameRef}>
      {nearView ? (
        <>
          {!loaded && (
            <div className="map-loading" aria-hidden="true">
              <Icon name="pin" size={26} />
              <span>{loadingLabel}</span>
            </div>
          )}
          <iframe
            className={loaded ? 'map-iframe is-loaded' : 'map-iframe'}
            src={src}
            title={title}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        <div className="map-loading" aria-hidden="true">
          <Icon name="pin" size={26} />
          <span>Map loads when you scroll to it</span>
        </div>
      )}
    </div>
  )
}

export default LazyMap