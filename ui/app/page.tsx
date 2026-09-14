'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Check, ShieldCheck, Thermometer, Workflow, Zap } from 'lucide-react'

const features = [
  {
    icon: Thermometer,
    title: 'See the incident early',
    text: 'Dual-sensor IoT telemetry (AHT20/SHT31) flags temperature excursion with cross-sensor drift verification in real time.',
  },
  {
    icon: Workflow,
    title: 'Coordinate multi-destination salvage',
    text: 'AWS Strands agent optimizes split routing across food processors, wholesale markets, and community food rescue.',
  },
  {
    icon: ShieldCheck,
    title: 'Keep decisions accountable',
    text: '14 telemetry and audit artifacts sealed in a SHA-256 Merkle tree, gated by a single-use human authorization token.',
  },
]

export default function LandingPage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Main navigation">
        <Link href="/" className="landing-brand">
          <span className="landing-mark"><i /><i /><i /></span>
          <span>PerishLock<small>Cold-chain defense</small></span>
        </Link>
        <div className="landing-links">
          <a href="#how-it-works">How it works</a>
          <a href="#principles">Principles</a>
          <Link href="/article">Read the article</Link>
          <Link href="/mission-control" className="landing-nav-cta">
            Open mission control <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <div className="landing-eyebrow">
            <span />AGENT-ASSISTED OPERATIONS FOR PERISHABLES
          </div>
          <h1>When the cold chain breaks, <em>people stay in control.</em></h1>
          <p className="landing-lead">
            PerishLock helps agricultural cooperatives respond to temperature breaches with Amazon Bedrock AgentCore memory, cryptographic Merkle evidence, and strict Human-in-the-Loop approval boundaries.
          </p>
          <div className="landing-actions">
            <Link href="/mission-control" className="landing-button primary">
              Explore mission control <ArrowRight size={17} />
            </Link>
            <Link href="/article" className="landing-button secondary">
              <BookOpen size={16} /> Read the build story
            </Link>
          </div>
          <div className="landing-proof">
            <div className="proof-avatars">
              <span>DO</span><span>PC</span><span>HF</span>
            </div>
            <p>
              <strong>Built for high-consequence operations</strong><br />
              Evidence first. Human approval always.
            </p>
          </div>
        </div>
        <div className="landing-visual" aria-label="PerishLock incident response preview">
          <div className="visual-glow" />
          <div className="landing-console">
            <div className="console-top">
              <span className="console-dots"><i /><i /><i /></span>
              <span>SALINAS VALLEY CO-OP / MISSION CONTROL</span>
              <span className="console-live"><i />Live</span>
            </div>
            <div className="console-body">
              <div className="console-kicker">ACTIVE INCIDENT <span>01</span></div>
              <h2>Cold room temperature breach</h2>
              <p>Chamber CR-4 · Fresh Roma tomatoes · 14,200 kg at risk ($9,230)</p>
              <div className="console-reading">
                <div>
                  <small>Current reading</small>
                  <strong>15.8°C</strong>
                  <span>Above 13.0°C policy trigger (Peak 18.2°C)</span>
                </div>
                <div className="mini-chart">
                  <svg viewBox="0 0 240 70" role="img" aria-label="Temperature rising above the trigger">
                    <path d="M4 53 C45 51 63 45 86 42 S117 35 139 32 S169 22 191 18 S218 8 237 5" />
                    <line x1="4" y1="37" x2="237" y2="37" />
                  </svg>
                </div>
              </div>
              <div className="console-alert">
                <ShieldCheck size={16} />
                <span>
                  <strong>Evidence packet complete</strong>
                  <small>14 artifacts sealed · SHA-256 Merkle root</small>
                </span>
                <Check size={16} />
              </div>
              <div className="console-footer">
                <span><b>95.0%</b> farmer value realization</span>
                <span className="console-pending"><i />Awaiting human decision</span>
              </div>
            </div>
          </div>
          <div className="floating-note">
            <Zap size={15} />
            <span>
              <strong>Agent prepared salvage options</strong>
              <small>Nothing approved or dispatched automatically</small>
            </span>
          </div>
        </div>
      </section>

      <section className="landing-strip">
        <span>Designed for moments when data is incomplete, time matters, and trust is non-negotiable.</span>
        <div>
          <span>Dual IoT Telemetry</span>
          <span>Merkle Evidence</span>
          <span>Bedrock AgentCore</span>
          <span>HITL Approval</span>
        </div>
      </section>

      <section id="how-it-works" className="landing-section">
        <div className="landing-section-intro">
          <span className="landing-eyebrow">A calmer way to respond</span>
          <h2>From uncertain signal to defensible action.</h2>
          <p>
            PerishLock gives coordinators the context to move quickly without turning an AI recommendation into an invisible, autonomous decision.
          </p>
        </div>
        <div className="landing-feature-grid">
          {features.map(({ icon: Icon, title, text }, index) => (
            <article className="landing-feature" key={title}>
              <div className="feature-number">0{index + 1}</div>
              <div className="feature-icon"><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="principles" className="landing-principles">
        <div>
          <span className="landing-eyebrow">The PerishLock principle</span>
          <h2>Agents prepare decisions for humans. They do not quietly make them.</h2>
        </div>
        <div className="principles-list">
          <div>
            <span>01</span>
            <p>
              <strong>Deterministic policy math</strong><br />
              Thresholds (&gt;13.0°C for 240+ min) and parametric eligibility rules stay explicit and testable.
            </p>
          </div>
          <div>
            <span>02</span>
            <p>
              <strong>Evidence as a product feature</strong><br />
              Every sensor reading, drift check, and policy event has a verifiable SHA-256 hash and timestamp.
            </p>
          </div>
          <div>
            <span>03</span>
            <p>
              <strong>Approval at the point of action</strong><br />
              Truck dispatch, payout authorization, and partner commitments require a cryptographic human token.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <span className="landing-eyebrow">Ready to inspect the workflow?</span>
          <h2>See how PerishLock turns a breach into an authorized salvage response.</h2>
        </div>
        <Link href="/mission-control" className="landing-button light">
          Open mission control <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="landing-footer">
        <span>PerishLock · Salinas Valley Cooperative cold-chain defense environment</span>
        <div>
          <Link href="/article">Build article</Link>
          <Link href="/mission-control">Mission control</Link>
        </div>
      </footer>
    </main>
  )
}
