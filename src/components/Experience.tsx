import { site } from '../site'

export const Experience = () => (
  <section className="band exp" id="experience" aria-labelledby="experience-title">
    <div className="wrap">
      <div className="sec-head label reveal">
        <h2 id="experience-title">Experience</h2>
        <span aria-hidden="true">02 / 03</span>
      </div>
      <ol className="rows">
        {site.experience.map(job => (
          <li key={job.title + job.start}>
            <a className="row reveal" href={job.href} target="_blank" rel="noopener">
              <div>
                <h3>{job.title}</h3>
                <p>{job.company}, {job.place}</p>
              </div>
              <span className="when">
                {job.current && <i aria-hidden="true" />}
                <time dateTime={job.start}>{job.startLabel}</time> – {job.endLabel}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  </section>
)
