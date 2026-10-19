function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = 'left',
  light = false,
  as: Tag = 'h2',
  className = '',
}) {
  const classes = [
    'section-head',
    align === 'center' ? 'section-head--center' : '',
    light ? 'section-head--light' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <Tag id={id}>{title}</Tag>
      {intro && <p>{intro}</p>}
    </div>
  )
}

export default SectionHeading
