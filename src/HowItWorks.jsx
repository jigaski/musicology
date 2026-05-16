import { Link } from 'react-router-dom'
import Starfield from './Starfield'
import dummyDataUrl from './assets/Dummy_Data.zip?url'
import './HowItWorks.css'

const STEPS = [
  {
    num: '01',
    title: 'Log in to Spotify',
    sub: 'Head to spotify.com/account and sign in to your account.',
  },
  {
    num: '02',
    title: 'Request your data',
    sub: 'Go to Privacy Settings → Download your data. Check "Extended streaming history" and submit the request. Spotify will email you within up to 30 days.',
  },
  {
    num: '03',
    title: 'Drop the zip onto Musicology',
    sub: "Once your email arrives, download the zip file and drag it onto the upload page — or click to browse. Everything is processed locally in your browser.",
  },
  {
    num: '04',
    title: 'Try the sample data',
    sub: "Don't want to wait? Download our sample zip and explore the app right now.",
    action: { href: dummyDataUrl, label: 'Download sample data' },
  },
]

export default function HowItWorks() {
  return (
    <div className="hiw">
      <Starfield />

      <div className="hiw-content">
        <Link to="/" className="hiw-back">← Back</Link>

        <span className="section-label">Guide</span>
        <h1 className="hiw-headline">
          How it <em>works</em>
        </h1>

        <ol className="hiw-steps">
          {STEPS.map((step) => (
            <li key={step.num} className="hiw-step">
              <span className="hiw-num">{step.num}</span>
              <div className="hiw-text">
                <h2 className="hiw-title">{step.title}</h2>
                <p className="hiw-sub">{step.sub}</p>
                {step.action && (
                  <a
                    href={step.action.href}
                    download
                    className="btn-primary hiw-download"
                  >
                    {step.action.label}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div className="hiw-cta">
          <Link to="/upload" className="btn-primary">Upload your data →</Link>
        </div>
      </div>
    </div>
  )
}
