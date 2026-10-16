import { site } from '../site'

export const Marquee = () => (
  <div className="marquee">
    <div className="track">
      <ul aria-label="Skills">
        {site.skills.map(s => <li key={s}>{s}</li>)}
      </ul>
      {/* Duplicate for a seamless loop */}
      <ul aria-hidden="true">
        {site.skills.map(s => <li key={s}>{s}</li>)}
      </ul>
    </div>
  </div>
)
