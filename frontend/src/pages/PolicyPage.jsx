import Reveal from '../components/Reveal.jsx'
import PageHero from '../components/PageHero.jsx'

function PolicyPage({ title, eyebrow, intro, documentTitle, description, blocks = [], list = [], breadcrumb }) {
  return (
    <div className="page-policy">
      <PageHero
        breadcrumb={breadcrumb}
        eyebrow={eyebrow}
        title={title}
        documentTitle={documentTitle}
        description={description}
      />

      <section className="policy-band">
        <div className="container">
          <Reveal>
            <div className="policy-body">
              {intro ? <p className="policy-intro">{intro}</p> : null}

              {list.length
                ? list.map((item, index) => (
                    <p key={index} className="policy-item">
                      {item}
                    </p>
                  ))
                : null}

              {blocks.map((block) => (
                <div key={block.heading}>
                  <h2>{block.heading}</h2>
                  {block.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default PolicyPage