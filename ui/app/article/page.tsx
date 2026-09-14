'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Database, GitBranch, LockKeyhole, Radio, ShieldCheck, Sparkles } from 'lucide-react'

const architecture = [
  { icon: Radio, label: 'AWS IoT Core & Dual Telemetry', text: 'Streams chamber telemetry from dual calibrated sensors (AHT20/SHT31) with real-time drift validation (≤1.5°C).' },
  { icon: GitBranch, label: 'Deterministic Parametric Engine', text: 'Evaluates SLA breach thresholds (>13.0°C for 240+ min) with auditable math, preventing LLM calculation drift.' },
  { icon: Sparkles, label: 'AWS Strands + Bedrock AgentCore', text: 'Assembles salvage options, evaluates partner constraints, and stores episodic context in Bedrock AgentCore Memory.' },
  { icon: Database, label: 'Merkle Evidence Vault & S3/DynamoDB', text: 'Seals 14 sensor and audit leaves into an immutable SHA-256 Merkle root for instant parametric claims settlement.' },
]

const principles = [
  'Keep policy math deterministic and mathematically inspectable.',
  'Make sensor drift and telemetry uncertainty explicit before triggering claims.',
  'Strict Human-in-the-Loop gate: agents prepare options, authorized humans hold dispatch tokens.',
  'Preserve immutable cryptographic evidence for cooperatives, adjusters, and farmers.',
]

export default function ArticlePage() {
  return (
    <main className="article-page">
      <nav className="article-nav" aria-label="Article navigation">
        <Link href="/" className="article-brand">
          <span className="article-mark"><i /><i /><i /></span>
          <span>PerishLock <small>Project story</small></span>
        </Link>
        <div className="article-nav-links">
          <a href="#architecture">Architecture</a>
          <a href="#principles">Design principles</a>
          <a href="#outcomes">Outcomes</a>
          <Link href="/mission-control" className="article-back">
            <ArrowLeft size={15} /> Mission control
          </Link>
        </div>
      </nav>

      <section className="article-hero">
        <div className="article-hero-copy">
          <div className="article-kicker">
            <span className="article-live-dot" /> AWS Builder Story · Good Neighbor Track
          </div>
          <h1>Agents for humans:<br /><em>building PerishLock</em></h1>
          <p className="article-dek">
            A human-in-the-loop cold-chain defense protocol built with the AWS Strands Agents SDK and Amazon Bedrock AgentCore Memory, turning temperature emergencies into 95% farmer value recovery.
          </p>
          <div className="article-hero-actions">
            <a className="article-button article-button-primary" href="#architecture">
              Explore the architecture <ArrowUpRight size={16} />
            </a>
            <Link className="article-button article-button-quiet" href="/mission-control">
              Open mission control
            </Link>
          </div>
          <div className="article-meta">
            <span><strong>6 min</strong> read</span>
            <span className="article-meta-line" />
            <span>Built with AWS Strands & Bedrock AgentCore</span>
            <span className="article-meta-line" />
            <span>PerishLock Team</span>
          </div>
        </div>
        <div className="hero-system-card" aria-label="PerishLock system overview">
          <div className="hero-system-top">
            <span>LIVE INCIDENT · CHAMBER CR-4</span>
            <span className="hero-status"><i /> Evidence ready</span>
          </div>
          <div className="hero-temperature">
            <strong>15.8°C</strong>
            <span>CURRENT TEMP (PEAK 18.2°C)</span>
          </div>
          <div className="hero-sparkline">
            <span /><span /><span /><span /><span /><span /><span /><b />
          </div>
          <div className="hero-system-grid">
            <div>
              <small>Inventory at risk</small>
              <strong>14,200 kg ($9,230)</strong>
            </div>
            <div>
              <small>Policy trigger</small>
              <strong>&gt; 13.0°C (255 min)</strong>
            </div>
            <div>
              <small>Human approval</small>
              <strong>HMAC Token Required</strong>
            </div>
            <div>
              <small>Evidence packet</small>
              <strong>14 sealed (SHA-256)</strong>
            </div>
          </div>
          <div className="hero-system-footer">
            <ShieldCheck size={15} /> The agent synthesized salvage options. No trucks or payouts execute without human authorization.
          </div>
        </div>
      </section>

      <section className="article-intro article-section">
        <div className="article-section-label">01 / The problem</div>
        <div>
          <h2>When 4 hours of refrigeration failure destroys a harvest.</h2>
          <p>
            In the agricultural heartland of Salinas Valley, smallholder farmer cooperatives store freshly harvested Roma tomatoes in community cold chambers. At 14:00, a power surge trips the secondary cooling compressor in Chamber CR-4. Inside sit 14,200 kg of premium produce worth $9,230.
          </p>
          <p>
            Above 13.0°C, bacterial soft rot accelerates exponentially. Within 4 hours, skin elasticity collapses and market value plummets toward zero. In traditional agriculture, insurance adjusters take weeks, claims are disputed, and 14 tons of food end up in a landfill.
          </p>
          <p>
            PerishLock transforms this crisis into a coordinated, evidence-backed defense: autonomous telemetry verification, parametric claim triggers, multi-facility salvage optimization, and strict Human-in-the-Loop dispatch gating.
          </p>
        </div>
      </section>

      <section id="architecture" className="article-architecture article-section">
        <div className="article-section-label">02 / The architecture</div>
        <div className="article-architecture-content">
          <h2>Context first. Authority always.</h2>
          <p>
            PerishLock cleanly separates deterministic policy math from agent reasoning. The deterministic engine validates sensor health and calculates threshold compliance; the AWS Strands agent evaluates routing trade-offs and prepares conditional salvage options for the cooperative coordinator.
          </p>
          <div className="architecture-list">
            {architecture.map(({ icon: Icon, label, text }, index) => (
              <div className="architecture-item" key={label}>
                <span className="architecture-number">0{index + 1}</span>
                <span className="architecture-icon"><Icon size={17} /></span>
                <div>
                  <strong>{label}</strong>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="principles" className="article-principles article-section">
        <div className="article-section-label">03 / The guardrails</div>
        <div>
          <div className="principles-heading">
            <h2>Useful without pretending to be autonomous.</h2>
            <span><LockKeyhole size={18} /> Human approval required</span>
          </div>
          <div className="principles-grid">
            {principles.map((item, index) => (
              <div className="principle" key={item}>
                <span>0{index + 1}</span>
                <CheckCircle2 size={17} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="outcomes" className="article-outcomes article-section">
        <div className="article-section-label">04 / The outcome</div>
        <div className="outcome-card">
          <div>
            <span className="article-kicker">The operating model</span>
            <h2>95.0% Value Recovery vs 100% Landfill Loss.</h2>
            <p>
              By splitting salvage across Pacific Canning Co. (8,000 kg for sauce processing), Salinas Wholesale (4,500 kg for immediate distribution), and Hope Community Food Bank (1,700 kg for community hunger relief), PerishLock realizes $8,768.50 for cooperative farmers while rescuing 1.7 tons of food.
            </p>
            <Link href="/mission-control" className="article-button article-button-primary">
              See PerishLock in action <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="outcome-quote">
            “The agent gathers telemetry context, calculates multi-facility logistics, and seals evidence. The human manager holds the single-use cryptographic token that authorizes real-world action.”
          </div>
        </div>
      </section>

      <footer className="article-footer">
        <div className="article-brand">
          <span className="article-mark"><i /><i /><i /></span>
          <span>PerishLock <small>Autonomous Cold-Chain Defense</small></span>
        </div>
        <span>Built for the AWS Agents for Humans Hackathon 2026</span>
        <Link href="/mission-control">
          Return to mission control <ArrowUpRight size={14} />
        </Link>
      </footer>
    </main>
  )
}
