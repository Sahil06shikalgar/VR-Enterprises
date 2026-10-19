import Reveal from './Reveal.jsx'

/*
 * Reusable responsive media frame.
 *
 * Wraps an illustration or photograph with a consistent frame, an explicit
 * aspect ratio (from width/height) to avoid layout shift, sensible lazy /
 * eager loading hints, an optional hover zoom for clickable images, and an
 * optional reveal animation.
 *
 * Illustrations and logos should use fit="contain"; photographs should use
 * fit="cover" with a deliberate `position` so faces / key objects stay in view.
 * `srcSet` / `sizes` can be supplied for raster images.
 */
function MediaFrame({
  src,
  alt = '',
  width,
  height,
  caption,
  variant = 'panel',
  fit = 'contain',
  position = 'center',
  priority = false,
  zoom = false,
  className = '',
  imgClassName = '',
  reveal = 0,
  revealY = 22,
  srcSet,
  sizes,
  children,
}) {
  const figure = (
    <figure
      className={`media media--${variant}${zoom ? ' media--zoom' : ''}${className ? ` ${className}` : ''}`}
    >
      <div className="media__frame">
        <img
          className={`media__img${imgClassName ? ` ${imgClassName}` : ''}`}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          style={{ objectFit: fit, objectPosition: position }}
        />
        {children}
      </div>
      {caption ? <figcaption className="media__caption">{caption}</figcaption> : null}
    </figure>
  )

  if (reveal === false) return figure
  return (
    <Reveal delay={reveal} y={revealY}>
      {figure}
    </Reveal>
  )
}

export default MediaFrame
