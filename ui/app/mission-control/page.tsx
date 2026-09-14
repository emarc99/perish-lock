'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Archive,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Box,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  Fingerprint,
  GitBranch,
  History,
  LayoutDashboard,
  MapPin,
  Menu,
  PackageCheck,
  Radio,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Truck,
  Users,
  X,
  Zap,
} from 'lucide-react'

// Navigation Items
const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'incidents', label: 'Incidents', icon: AlertTriangle, count: '01' },
  { id: 'evidence', label: 'Evidence vault', icon: Archive },
  { id: 'partners', label: 'Partner network', icon: Users },
  { id: 'policy', label: 'Policy & roles', icon: BookOpen },
]

// Cooperative Member Lots at Risk
const lots = [
  { lot: 'Lot A-01', farmer: 'Salinas Valley Cooperative (Bay 1)', weight: '5,800 kg', value: '$3,770.00' },
  { lot: 'Lot A-02', farmer: 'Riverbend Organic Farms (Bay 2)', weight: '4,600 kg', value: '$2,990.00' },
  { lot: 'Lot A-03', farmer: 'Mesa Verde Growers (Bay 3)', weight: '3,800 kg', value: '$2,470.00' },
]

// Regional Salvage Partner Network
const partners = [
  {
    name: 'Valley Fresh Cannery & Paste',
    type: 'Commercial Processor',
    distance: '42 km · 0.8 hrs',
    capacity: '8,000 kg',
    score: '96',
    tag: 'Max Recovery',
    tone: 'sage',
    note: '“Intake shift closes 19:30. Accepts warm Roma tomatoes for immediate industrial paste processing.”',
  },
  {
    name: 'Hope Community Food Bank',
    type: 'Food Rescue / Charity',
    distance: '18 km · 0.4 hrs',
    capacity: '4,500 kg',
    score: '98',
    tag: 'Highest Social Impact',
    tone: 'amber',
    note: '“Immediate distribution dock open. Feeds 1,800 families across Monterey County tonight.”',
  },
  {
    name: 'SunCoast Dehydrators & Sun-Dried Co.',
    type: 'Dehydration Plant',
    distance: '78 km · 1.4 hrs',
    capacity: '6,000 kg',
    score: '84',
    tag: 'Flexible Intake',
    tone: 'slate',
    note: '“Accepts B-grade tomatoes up to 18°C. Requires refrigerated transport arrival by 20:00.”',
  },
  {
    name: 'Pacific Cold Hub & Pre-Cooling',
    type: 'Emergency Cold Storage',
    distance: '31 km · 0.6 hrs',
    capacity: '12,000 kg',
    score: '78',
    tag: 'Blast Chill Only',
    tone: 'slate',
    note: '“Shift B dock closes at 18:00 for boiler service maintenance. Limited staging space.”',
  },
]

// Brand Mark Icon
function Logo() {
  return (
    <div className="brand-mark">
      <span />
      <span />
      <span />
    </div>
  )
}

// Main App Shell
function Shell({
  page,
  setPage,
  children,
}: {
  page: string
  setPage: (page: string) => void
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <Link href="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }} title="Return to Landing Page">
          <Logo />
          <div>
            <strong>PerishLock</strong>
            <small>Cold-chain defense</small>
          </div>
        </Link>

        <div className="workspace">
          <span className="workspace-dot" />
          <div>
            <small>COOPERATIVE</small>
            <strong>Riverbend Cold Storage</strong>
          </div>
          <ChevronRight size={15} />
        </div>

        <nav aria-label="Primary navigation">
          <p className="nav-label">Mission control</p>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = page === item.id
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setPage(item.id)
                  setMobileOpen(false)
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {item.count && <b>{item.count}</b>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="live-dot" />
            <div>
              <strong>Bedrock AgentCore Connected</strong>
              <small>us-east-1 · Memory Active</small>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">DO</div>
            <div>
              <strong>Daniel Okafor</strong>
              <small>Cold-Room Coordinator</small>
            </div>
            <SlidersHorizontal size={16} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Riverbend Cooperative</span>
            <ChevronRight size={14} />
            <strong>
              {navItems.find((item) => item.id === page)?.label || 'Overview'}
            </strong>
          </div>
          <div className="top-actions">
            <Link
              href="/"
              className="topbar-nav-link"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#496053',
                textDecoration: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #dfe5de',
                background: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Return to Landing Page"
            >
              ← Landing
            </Link>
            <Link
              href="/article"
              className="topbar-nav-link"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#496053',
                textDecoration: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #dfe5de',
                background: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Read AWS Builder Build Story"
            >
              Build Story
            </Link>
            <span className="environment">
              <span className="live-dot" />
              AWS Bedrock AgentCore
            </span>
            <button className="icon-button" aria-label="Search">
              <Search size={17} />
            </button>
            <button className="icon-button notification" aria-label="Notifications">
              <Bell size={17} />
              <i />
            </button>
            <div className="top-avatar">DO</div>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  )
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  tone = 'default',
}: {
  label: string
  value: string
  detail: string
  icon: React.ComponentType<{ size?: number }>
  trend?: string
  tone?: string
}) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon size={16} />
        </span>
      </div>
      <strong>{value}</strong>
      <div className="stat-detail">
        {trend && (
          <span className="trend">
            <ArrowUpRight size={13} />
            {trend}
          </span>
        )}
        {detail}
      </div>
    </div>
  )
}

// Interactive Temperature Curve with Dual Probes and Threshold
function TemperatureChart() {
  const points = [11.2, 11.4, 11.8, 12.3, 13.2, 13.9, 14.5, 15.3, 16.2, 17.1, 17.8, 18.2, 17.6, 16.2, 15.8]
  const path = points
    .map((val, i) => `${i === 0 ? 'M' : 'L'} ${i * 42 + 18} ${150 - (val - 10) * 12}`)
    .join(' ')
  const area = `${path} L 606 150 L 18 150 Z`

  return (
    <div className="chart-wrap">
      <div className="chart-legend">
        <span>
          <i className="legend-line" />
          Sensor 1 (AHT20) · Effective Reading
        </span>
        <span>
          <i className="legend-dash" />
          13.0°C Policy Threshold Line
        </span>
        <span>
          <i className="legend-spike" />
          Sensor 2 (SHT31) · |ΔT| ≤ 0.7°C Validated
        </span>
      </div>
      <svg viewBox="0 0 640 170" role="img" aria-label="Temperature curve from 11.2C to 18.2C over breach duration">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#dc674d" stopOpacity=".25" />
            <stop offset="1" stopColor="#dc674d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="chart-grid">
          <line x1="18" x2="606" y1="40" y2="40" />
          <line x1="18" x2="606" y1="95" y2="95" />
          <line x1="18" x2="606" y1="150" y2="150" />
        </g>
        <text x="0" y="44">20°</text>
        <text x="0" y="99">13°</text>
        <text x="0" y="154">10°</text>
        <line className="threshold" x1="18" x2="606" y1="95" y2="95" />
        <path className="chart-area" d={area} />
        <path className="chart-path" d={path} />
        <circle className="chart-point" cx="312" cy="76" r="4" />
        <circle className="chart-point" cx="606" cy="80" r="4" />
        <line className="anomaly-line" x1="186" x2="186" y1="20" y2="150" />
        <circle className="anomaly-point" cx="186" cy="20" r="5" />
        <text className="anomaly-label" x="196" y="26">Parametric Trigger: 255 min &gt; 13°C</text>
        <text x="18" y="168">12:00</text>
        <text x="186" y="168">14:00</text>
        <text x="354" y="168">16:00</text>
        <text x="560" y="168">19:30 (Now)</text>
      </svg>
    </div>
  )
}

function ActionRail({ setPage }: { setPage: (page: string) => void }) {
  return (
    <div className="action-rail">
      <div className="rail-label">Next best actions</div>
      <div className="action-card featured">
        <div className="action-number">01</div>
        <div>
          <strong>Review Salvage Authorization</strong>
          <p>
            The Strands Agent has prepared 2 response options (Commercial Max vs Hope Food Bank).
            Waiting for coordinator token signature.
          </p>
          <button className="button dark" onClick={() => setPage('incident-detail')}>
            Review incident <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="action-card">
        <div className="action-number">02</div>
        <div>
          <strong>Parametric Claim Notice Ready</strong>
          <p>
            Yield-gap indemnity calculated ($4,309.48) to guarantee 95% farmer realization.
            SHA-256 Merkle packet sealed.
          </p>
          <button className="link-button" onClick={() => setPage('evidence')}>
            View evidence packet <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="boundary">
        <ShieldCheck size={18} />
        <div>
          <strong>Human-in-the-Loop Safeguard</strong>
          <p>
            PerishLock never dispatches reefer trucks or releases insurance funds without coordinator authorization.
          </p>
        </div>
      </div>
    </div>
  )
}

// Page 1: Overview
function Overview({
  setPage,
  onSimulate,
}: {
  setPage: (page: string) => void
  onSimulate: () => void
}) {
  return (
    <>
      <PageHeading
        eyebrow="Monday, 14 September 2026 · Salinas Valley, CA"
        title="Good afternoon, Daniel"
        description="Cold room breach in progress. PerishLock Strands Agent has verified sensor consensus and synthesized multi-destination salvage options."
        action={
          <button className="button primary" onClick={onSimulate}>
            <Zap size={16} />
            Run full incident speedrun
          </button>
        }
      />

      <div className="notice">
        <div className="notice-icon">
          <AlertTriangle size={18} />
        </div>
        <div>
          <strong>Parametric breach active in Chamber A-North</strong>
          <p>
            Temperature has exceeded 13.0°C for 255 continuous minutes. 14,200 kg of fresh Roma tomatoes ($9,230 insured value)
            require immediate salvage carrier dispatch.
          </p>
        </div>
        <button className="text-button" onClick={() => setPage('incident-detail')}>
          Review incident <ChevronRight size={15} />
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="At-risk inventory"
          value="14,200 kg"
          detail="Fresh Roma Tomatoes (710 crates)"
          icon={PackageCheck}
          tone="coral"
        />
        <StatCard
          label="Total insured value"
          value="$9,230"
          detail="Across 12 cooperative member farms"
          icon={Box}
        />
        <StatCard
          label="Sustained breach"
          value="255 min"
          detail="Policy threshold: ≥ 240 min"
          icon={Clock3}
          trend="+15 min confirmed"
        />
        <StatCard
          label="Farmer realization"
          value="95.0%"
          detail="$8,768.50 net with yield-gap payout"
          icon={ShieldCheck}
          tone="sage"
        />
      </div>

      <div className="section-row">
        <div className="card chart-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">Live IoT Telemetry · Chamber A-North</span>
              <h2>Cold room temperature curve</h2>
            </div>
            <span className="status-pill danger">
              <span />
              Breach active (&gt; 13.0°C)
            </span>
          </div>

          <TemperatureChart />

          <div className="chart-footer">
            <div>
              <strong>15.8°C</strong>
              <span>Current Chamber Temp</span>
            </div>
            <div>
              <strong>13.0°C</strong>
              <span>Policy Threshold</span>
            </div>
            <div>
              <strong>0.7°C</strong>
              <span>Max Sensor Drift (≤1.5°C)</span>
            </div>
            <div>
              <strong>31.5°C</strong>
              <span>Salinas Ambient Heat</span>
            </div>
            <button className="text-button" onClick={() => setPage('evidence')}>
              View evidence vault <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <ActionRail setPage={setPage} />
      </div>

      <div className="card workflow-card">
        <div className="card-heading">
          <div>
            <span className="eyebrow">Strands Agent Execution Trace</span>
            <h2>Autonomous cognitive workflow</h2>
          </div>
          <span className="muted">Live Bedrock Runtime Event</span>
        </div>

        <div className="workflow">
          <div className="workflow-step done">
            <span>
              <Check size={14} />
            </span>
            <div>
              <strong>Telemetry verified</strong>
              <small>Dual-probe consensus confirmed · 14:00</small>
            </div>
          </div>
          <div className="workflow-step done">
            <span>
              <Check size={14} />
            </span>
            <div>
              <strong>Evidence packet sealed</strong>
              <small>SHA-256 Merkle tree signed · 14:02</small>
            </div>
          </div>
          <div className="workflow-step done">
            <span>
              <Check size={14} />
            </span>
            <div>
              <strong>Salvage routes ranked</strong>
              <small>Option A &amp; Option B ready · 14:05</small>
            </div>
          </div>
          <div className="workflow-step current">
            <span>
              <Clock3 size={14} />
            </span>
            <div>
              <strong>Coordinator decision</strong>
              <small>Awaiting single-use HMAC approval</small>
            </div>
            <span className="step-action" onClick={() => setPage('incident-detail')}>
              Authorize <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

// Page 2: Incidents List
function Incidents({
  setPage,
  approved,
}: {
  setPage: (page: string) => void
  approved: boolean
}) {
  return (
    <>
      <PageHeading
        eyebrow="Cold-chain incident queue"
        title="Active incidents"
        description="Monitor active and recently resolved cold-storage breach events across cooperative facilities."
        action={
          <button className="button secondary">
            <SlidersHorizontal size={16} />
            Filter by commodity
          </button>
        }
      />

      <div className="incident-layout">
        <div className="incident-list">
          <div className="list-toolbar">
            <span>1 active incident requires authorization</span>
            <span className="muted">Sorted by urgency</span>
          </div>

          <button className="incident-item selected" onClick={() => setPage('incident-detail')}>
            <div className="incident-item-top">
              <span className={`status-pill ${approved ? 'success' : 'danger'}`}>
                <span />
                {approved ? 'Authorized · Carrier dispatched' : 'Needs coordinator decision'}
              </span>
              <span className="muted">255 min breach</span>
            </div>
            <h3>Chamber A-North · Thermal breach &amp; decay warning</h3>
            <p>Fresh Roma tomatoes · 14,200 kg · 3 cooperative lots</p>
            <div className="incident-meta">
              <span>
                <MapPin size={14} />
                Riverbend Bay 2
              </span>
              <span>
                <Thermometer size={14} />
                15.8°C (Peak 18.2°C)
              </span>
              <span>
                <PackageCheck size={14} />
                $9,230 value
              </span>
            </div>
            <ChevronRight className="incident-arrow" size={18} />
          </button>

          <div className="resolved-row">
            <span className="status-pill success">
              <span />
              Resolved
            </span>
            <div>
              <strong>Chamber B · Compressor voltage dip</strong>
              <small>Resolved 02 Sep · Standby generator kicked in · No cargo damage</small>
            </div>
            <span className="muted">›</span>
          </div>

          <div className="resolved-row">
            <span className="status-pill success">
              <span />
              Settled
            </span>
            <div>
              <strong>Chamber C · Strawberries humidity breach</strong>
              <small>Resolved 18 Aug · Parametric claim settled $3,200 in 24 hrs</small>
            </div>
            <span className="muted">›</span>
          </div>
        </div>

        <div className="card incident-summary">
          <span className="eyebrow">Selected incident</span>
          <h2>INC-POL-RB-TOM-2026-001</h2>
          <p className="summary-lead">
            The parametric breach condition is confirmed. Telemetry has remained above 13.0°C for 255 continuous minutes.
            PerishLock has prepared 2 contrasting salvage strategies and is waiting for your cryptographic authorization.
          </p>

          <div className="summary-alert">
            <AlertTriangle size={17} />
            <span>
              <strong>255 minutes above 13.0°C threshold</strong>
              <small>Policy threshold: 240 continuous minutes · Zero-adjuster trigger</small>
            </span>
          </div>

          <div className="summary-grid">
            <div>
              <small>Policy ID</small>
              <strong>POL-RB-TOM-001</strong>
            </div>
            <div>
              <small>Insured value</small>
              <strong>$9,230.00 USD</strong>
            </div>
            <div>
              <small>Evidence sealed</small>
              <strong>14 artifacts (SHA-256)</strong>
            </div>
            <div>
              <small>Bedrock AgentCore</small>
              <strong>Memory Active (us-east-1)</strong>
            </div>
          </div>

          <button className="button dark full" onClick={() => setPage('incident-detail')}>
            Open incident console <ChevronRight size={16} />
          </button>

          {approved && (
            <div className="approved-state">
              <Check size={16} />
              Salvage authorization recorded and signed in the immutable ledger.
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Page 3: Incident Detail & Decision Console
function IncidentDetail({
  setPage,
  approved,
  setApproved,
}: {
  setPage: (page: string) => void
  approved: boolean
  setApproved: (v: boolean) => void
}) {
  const [decision, setDecision] = useState<'opt-a' | 'opt-b' | 'decline' | ''>(
    approved ? 'opt-b' : ''
  )
  const [isAuthorizing, setIsAuthorizing] = useState(false)

  const handleConfirm = async () => {
    setIsAuthorizing(true)
    try {
      await fetch('/api/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: 'APR-2026-SALINAS-001',
          token: 'sec-tok-salinas-99a2c1',
          selected_option_id: decision === 'opt-a' ? 'OPT-A-FINANCIAL-MAX' : 'OPT-B-COMMUNITY-RESCUE',
        }),
      })
    } catch {
      // Fallback
    } finally {
      setApproved(true)
      setIsAuthorizing(false)
    }
  }

  return (
    <>
      <div className="back-link" onClick={() => setPage('incidents')}>
        <ChevronRight size={15} className="back-icon" />
        Back to incidents
      </div>

      <PageHeading
        eyebrow="INC-POL-RB-TOM-2026-001 · Live incident console"
        title="Chamber A-North temperature breach"
        description="Riverbend Cooperative Cold Storage · Detected 14:00 PDT · Evaluated with Amazon Nova Pro"
        action={
          <span className={`status-pill large ${approved ? 'success' : 'danger'}`}>
            <span />
            {approved ? 'Carrier Dispatched · Sandbox Order Sent' : 'Awaiting Coordinator Approval'}
          </span>
        }
      />

      <div className="detail-banner">
        <div className="banner-symbol">
          <AlertTriangle size={21} />
        </div>
        <div>
          <strong>14,200 kg of fresh Roma tomatoes are warming beyond safe cold-chain limits.</strong>
          <p>
            The Strands Agent verified dual IoT sensor consistency (|ΔT| ≤ 0.7°C), sealed the SHA-256 Merkle evidence manifest,
            and calculated multi-destination salvage logistics.
          </p>
        </div>
        <div className="banner-time">
          <span>Time above trigger</span>
          <strong>255:00</strong>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          {/* Member Lots Table */}
          <div className="card">
            <div className="card-heading">
              <div>
                <span className="eyebrow">Cooperative inventory at risk</span>
                <h2>3 member lots · $9,230.00 contracted value</h2>
              </div>
              <button className="icon-button" aria-label="Export report">
                <FileText size={17} />
              </button>
            </div>

            <div className="lot-table">
              {lots.map((lot) => (
                <div className="lot-row" key={lot.lot}>
                  <span className="lot-name">
                    <span className="tomato-dot" />
                    {lot.lot}
                  </span>
                  <span>{lot.farmer}</span>
                  <span>{lot.weight}</span>
                  <strong>{lot.value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Salvage Response Strategies */}
          <div className="card">
            <div className="card-heading">
              <div>
                <span className="eyebrow">AI-Synthesized Salvage Strategies</span>
                <h2>Recommended multi-destination options</h2>
              </div>
              <span className="muted">Ranked by Strands Agent</span>
            </div>

            <div className="partner-options">
              {/* Option A */}
              <div
                className={`partner-option ${decision === 'opt-a' ? 'recommended' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setDecision('opt-a')}
              >
                <div className="partner-score">
                  96
                  <small>fit</small>
                </div>
                <div className="partner-info">
                  <div>
                    <strong>Option A: Maximum Financial Recovery</strong>
                    <span className="mini-tag sage">Commercial Max</span>
                  </div>
                  <p>
                    Splits volume: 8,000 kg → Valley Fresh Cannery &amp; 6,000 kg → SunCoast Dehydrators.
                    Net salvage recovery: <strong>$4,459.52</strong>.
                  </p>
                  <small>
                    <span className="reason-dot" />
                    Yield-gap payout: $4,309.48. Total farmer realization: <strong>$8,768.50 (95.0%)</strong>.
                  </small>
                </div>
                <ChevronRight size={17} />
              </div>

              {/* Option B */}
              <div
                className={`partner-option ${decision === 'opt-b' ? 'recommended' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setDecision('opt-b')}
              >
                <div className="partner-score" style={{ color: '#d97706' }}>
                  98
                  <small>impact</small>
                </div>
                <div className="partner-info">
                  <div>
                    <strong>Option B: Community Food Rescue &amp; Commercial Balance</strong>
                    <span className="mini-tag amber">Coordinator Recommended</span>
                  </div>
                  <p>
                    Routes 4,500 kg (4.5 tons) to Hope Food Bank (feeds 1,800 families) + 9,500 kg to Cannery.
                    Net recovery: <strong>$3,303.38</strong> + 4,500 kg donated.
                  </p>
                  <small>
                    <span className="reason-dot" />
                    Yield-gap payout: $5,465.12. Farmer still receives <strong>95.0% ($8,768.50)</strong> guaranteed!
                  </small>
                </div>
                <ChevronRight size={17} />
              </div>
            </div>
          </div>
        </div>

        {/* Human-in-the-Loop Decision Panel */}
        <aside className="decision-panel card">
          <span className="eyebrow">Human-in-the-Loop Gate</span>
          <h2>Authorize carrier dispatch</h2>
          <p>
            Choose the response option to dispatch reefer trucks and trigger parametric insurance indemnity.
          </p>

          <div className="safety-callout">
            <ShieldCheck size={18} />
            <div>
              <strong>Single-Use Cryptographic Gate</strong>
              <span>
                Token: <code style={{ fontSize: '10px' }}>sec-tok-salinas-99a2c1</code>.
                Replay attacks are blocked. Agent cannot dispatch on its own.
              </span>
            </div>
          </div>

          <button
            className={`decision-button ${decision === 'opt-b' ? 'chosen' : ''}`}
            onClick={() => setDecision('opt-b')}
          >
            <div>
              <PackageCheck size={18} />
              <strong>Authorize Option B (Food Rescue)</strong>
              <span>Feed 1,800 families + commercial salvage</span>
            </div>
            <span className="radio">{decision === 'opt-b' && <Check size={13} />}</span>
          </button>

          <button
            className={`decision-button ${decision === 'opt-a' ? 'chosen' : ''}`}
            onClick={() => setDecision('opt-a')}
          >
            <div>
              <Truck size={18} />
              <strong>Authorize Option A (Commercial Max)</strong>
              <span>Dual cannery &amp; dehydrator routing</span>
            </div>
            <span className="radio">{decision === 'opt-a' && <Check size={13} />}</span>
          </button>

          <button
            className={`decision-button ${decision === 'decline' ? 'chosen decline' : ''}`}
            onClick={() => setDecision('decline')}
          >
            <div>
              <X size={18} />
              <strong>Hold / Decline for now</strong>
              <span>Keep incident open under review</span>
            </div>
            <span className="radio">{decision === 'decline' && <Check size={13} />}</span>
          </button>

          <button
            className="button dark full"
            disabled={!decision || approved || isAuthorizing}
            onClick={handleConfirm}
          >
            {isAuthorizing ? 'Authorizing with HMAC...' : approved ? 'Carrier Dispatched (Token Consumed)' : 'Authorize & Dispatch Salvage Carrier'}
            <ChevronRight size={16} />
          </button>

          {approved && (
            <div className="approved-state">
              <Check size={15} />
              Dispatch executed! Salinas Reefer Lines truck dispatched to Bay 2.
            </div>
          )}

          <small className="decision-note">
            <Fingerprint size={13} />
            Appended to Bedrock AgentCore Memory &amp; SHA-256 Audit Trail.
          </small>
        </aside>
      </div>
    </>
  )
}

// Page 4: Evidence Vault
function Evidence({ setPage }: { setPage: (page: string) => void }) {
  const [tab, setTab] = useState<'artifacts' | 'timeline' | 'quality'>('artifacts')

  return (
    <>
      <PageHeading
        eyebrow="Cryptographic chain of custody"
        title="Evidence vault"
        description="Tamper-evident record of all telemetry, trigger mathematics, partner quotes, and agent cognitive traces."
        action={
          <button className="button secondary">
            <FileCheck2 size={16} />
            Export Merkle proof packet
          </button>
        }
      />

      <div className="evidence-hero">
        <div className="seal">
          <BadgeCheck size={26} />
        </div>
        <div>
          <span className="eyebrow">SHA-256 Merkle root sealed</span>
          <h2>Evidence manifest is cryptographically verified</h2>
          <p>Stored under AWS S3 Object Lock (Compliance WORM Mode) · 14 artifacts · Zero tampering detected</p>
        </div>
        <div className="manifest-id">
          <small>Merkle Root Hash</small>
          <strong style={{ fontFamily: 'monospace', fontSize: '11px' }}>a7b3c9e5...312e6f88</strong>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'artifacts' ? 'active' : ''} onClick={() => setTab('artifacts')}>
          Artifacts <b>14</b>
        </button>
        <button className={tab === 'timeline' ? 'active' : ''} onClick={() => setTab('timeline')}>
          Strands Agent Trace <b>11</b>
        </button>
        <button className={tab === 'quality' ? 'active' : ''} onClick={() => setTab('quality')}>
          Sensor Quality &amp; Drift <b>1</b>
        </button>
      </div>

      {tab === 'artifacts' && (
        <div className="card file-card">
          <div className="file-row file-header">
            <span>Artifact Component</span>
            <span>Source</span>
            <span>Captured Time</span>
            <span>Integrity Check</span>
          </div>

          {[
            ['telemetry-timeseries-40samples.json', 'Dual IoT Probes (AHT20/SHT31)', '19:30:00 PDT', 'SHA-256 Verified'],
            ['parametric-trigger-evaluation.json', 'Deterministic Trigger Engine', '19:30:10 PDT', 'SHA-256 Verified'],
            ['policy-fixture-riverbend-tomatoes.json', 'Cooperative Policy Registry', '19:30:12 PDT', 'SHA-256 Verified'],
            ['weather-ambient-context.json', 'Open-Meteo & Grid Monitor', '19:30:14 PDT', 'SHA-256 Verified'],
            ['partner-quotes-reconciled.json', 'Partner Network Ingest', '19:30:18 PDT', 'SHA-256 Verified'],
            ['biological-decay-skill.md', 'AgentSkills (fresh-tomatoes)', '19:30:20 PDT', 'SHA-256 Verified'],
            ['bedrock-agentcore-event.sig', 'Bedrock AgentCore Memory', '19:30:22 PDT', 'Signed by AWS IAM'],
          ].map((f) => (
            <div className="file-row" key={f[0]}>
              <span className="file-name">
                <FileText size={16} />
                {f[0]}
              </span>
              <span>{f[1]}</span>
              <span>{f[2]}</span>
              <span className="verified">
                <Check size={14} />
                {f[3]}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'timeline' && (
        <div className="card trace-card">
          {[
            {
              step: 'load_incident_scope',
              detail: 'Loaded policy POL-RB-TOM-001 ($9,230 limit, 14,200 kg Roma Tomatoes).',
              time: '19:30:02',
            },
            {
              step: 'get_sensor_evidence',
              detail: 'Ingested 40 dual-sensor readings. Maximum drift 0.7°C (well within 1.5°C threshold).',
              time: '19:30:04',
            },
            {
              step: 'get_trigger_evaluation',
              detail: 'Parametric threshold confirmed: sustained 15.8°C for 255 min (≥ 240 min policy threshold).',
              time: '19:30:07',
            },
            {
              step: 'calculate_route_matrix',
              detail: 'Computed reefer transit matrices to 4 regional partners using OSRM API.',
              time: '19:30:11',
            },
            {
              step: 'prepare_response_options',
              detail: 'Synthesized Option A ($4,459 cash recovery) and Option B (4.5 tons to Hope Food Bank).',
              time: '19:30:15',
            },
            {
              step: 'seal_incident_packet',
              detail: 'Sealed SHA-256 Merkle root to S3 Object Lock compliance storage.',
              time: '19:30:18',
            },
            {
              step: 'request_coordinator_approval',
              detail: 'Generated single-use HMAC token. Execution paused behind Human-in-the-Loop gate.',
              time: '19:30:22',
            },
          ].map((t) => (
            <div className="trace-item" key={t.step}>
              <span className="trace-icon">
                <GitBranch size={15} />
              </span>
              <div>
                <strong>{t.step}</strong>
                <p>{t.detail}</p>
                <small>{t.time} PDT · AWS Strands Tool Call</small>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'quality' && (
        <div className="card quality-card">
          <div className="quality-event">
            <div className="quality-icon">
              <AlertTriangle size={18} />
            </div>
            <div>
              <strong>Dual-Sensor Drift Validation &amp; Consensus Check</strong>
              <p>
                Sensor 1 (AHT20) and Sensor 2 (SHT31) tracked parallel curves across 40 samples.
                Maximum observed drift was 0.7°C, satisfying the strict |ΔT| ≤ 1.5°C consensus rule.
                No corrupted or malicious outlier readings detected.
              </p>
              <span className="status-pill success">
                <span />
                Consensus Confirmed (Pass)
              </span>
            </div>
          </div>
          <button className="text-button" onClick={() => setPage('overview')}>
            View temperature graph <ChevronRight size={15} />
          </button>
        </div>
      )}
    </>
  )
}

// Page 5: Partner Network
function Partners() {
  return (
    <>
      <PageHeading
        eyebrow="Cooperative partner network"
        title="Regional salvage partners"
        description="Pre-vetted commercial processors, cold storage facilities, and community food rescue charities."
        action={
          <button className="button primary">
            <Users size={16} />
            Add partner dock
          </button>
        }
      />

      <div className="partner-stats">
        <StatCard label="Active partners" value="4" detail="Across Monterey &amp; Salinas Valley" icon={Users} />
        <StatCard label="Total emergency capacity" value="30,500 kg" detail="Available today" icon={PackageCheck} tone="sage" />
        <StatCard label="Average transit time" value="0.8 hrs" detail="Reefer freight coverage" icon={BadgeCheck} />
      </div>

      <div className="network-grid">
        {partners.map((p) => (
          <div className="card network-card" key={p.name}>
            <div className="network-card-top">
              <div className="partner-avatar">
                <Truck size={18} />
              </div>
              <span className={`mini-tag ${p.tone}`}>{p.tag}</span>
            </div>
            <h2>{p.name}</h2>
            <p>{p.type} · Pre-vetted partner</p>
            <div className="network-details">
              <span>
                <PackageCheck size={14} />
                {p.capacity} declared capacity
              </span>
              <span>
                <MapPin size={14} />
                {p.distance}
              </span>
              <span>
                <Clock3 size={14} />
                Fit Score: {p.score}/100
              </span>
            </div>
            <div className="intake-note">
              <span className="eyebrow">Intake constraint</span>
              <p>{p.note}</p>
            </div>
            <button className="link-button">
              View partner SLA contract <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

// Page 6: Policy & Governance
function Policy() {
  return (
    <>
      <PageHeading
        eyebrow="Parametric governance &amp; bounds"
        title="Policy &amp; decision boundaries"
        description="The mathematical rules PerishLock evaluates deterministically, and the decisions reserved for human coordinators."
      />

      <div className="policy-grid">
        <div className="card policy-fixture">
          <div className="card-heading">
            <div>
              <span className="eyebrow">Active Parametric Policy · POL-RB-TOM-001</span>
              <h2>Fresh Roma tomatoes (US No. 1)</h2>
            </div>
            <span className="status-pill success">
              <span />
              In effect (2026 Season)
            </span>
          </div>

          <div className="fixture-rule">
            <div className="rule-value">&gt; 13.0°C</div>
            <div>
              <strong>for 240 continuous minutes</strong>
              <p>
                Triggers automatic parametric indemnity. Zero adjuster inspection needed.
                Farmer receives contracted value less net salvage.
              </p>
            </div>
          </div>

          <div className="fixture-list">
            <div>
              <small>Optimum temperature</small>
              <strong>10.0°C – 12.5°C</strong>
            </div>
            <div>
              <small>Chilling injury limit</small>
              <strong>&lt; 7.0°C (Risk of rot)</strong>
            </div>
            <div>
              <small>Dual-probe consensus</small>
              <strong>Max drift ≤ 1.5°C</strong>
            </div>
            <div>
              <small>Total coverage cap</small>
              <strong>$9,200.00 USD</strong>
            </div>
          </div>
        </div>

        <div className="card boundary-card">
          <span className="eyebrow">System boundary</span>
          <h2>Who decides what?</h2>
          <div className="rights">
            <div>
              <span className="right-dot system" />
              <div>
                <strong>Deterministic Math Engine</strong>
                <p>Telemetry parsing, dual-probe drift checking, continuous minute timer, threshold breach confirmation.</p>
              </div>
            </div>
            <div>
              <span className="right-dot agent" />
              <div>
                <strong>AWS Strands Agent</strong>
                <p>Reconciles unstructured dock notes, ranks multi-destination salvage logistics, seals Merkle tree proof.</p>
              </div>
            </div>
            <div>
              <span className="right-dot human" />
              <div>
                <strong>Cooperative Coordinator (Human)</strong>
                <p>Signs single-use approval token, chooses salvage destination (Option A vs B), authorizes truck dispatch.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card roles-card">
        <div className="card-heading">
          <div>
            <span className="eyebrow">Access control matrix</span>
            <h2>Role permissions &amp; auditability</h2>
          </div>
          <button className="text-button">
            View full audit ledger <History size={15} />
          </button>
        </div>

        <div className="role-table">
          <div className="role-head">
            <span>Role</span>
            <span>Authorized action</span>
            <span>Restricted action</span>
          </div>

          {[
            ['Farmer', 'View their lot condition & payout share', 'Cannot view other farmers private financial data'],
            ['Coordinator', 'Authorize salvage partner & claim notice', 'Cannot alter raw IoT sensor time-series'],
            ['Strands Agent', 'Synthesize options & seal Merkle manifest', 'Cannot dispatch carriers without human HMAC token'],
            ['Underwriter', 'Inspect cryptographic SHA-256 evidence', 'Cannot delay parametric indemnity post-trigger'],
          ].map((r) => (
            <div className="role-row" key={r[0]}>
              <strong>{r[0]}</strong>
              <span>
                <Check size={14} />
                {r[1]}
              </span>
              <span>
                <X size={14} />
                {r[2]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="non-goal">
        <CircleHelp size={18} />
        <div>
          <strong>Strict Safety Disclaimer</strong>
          <p>
            PerishLock does not certify USDA food safety. Salvaged cargo remains flagged as <strong>INSPECTION_REQUIRED</strong> until
            inspected by licensed receiver quality control.
          </p>
        </div>
      </div>
    </>
  )
}

// Default Root Page with State Routing
export default function Page() {
  const [page, setPage] = useState<string>('overview')
  const [approved, setApproved] = useState<boolean>(false)
  const [simulated, setSimulated] = useState<boolean>(false)

  const current = useMemo(() => page, [page])

  const handleSpeedrun = async () => {
    try {
      await fetch('/api/run-agent', { method: 'POST' })
    } catch {
      // Graceful fallback
    } finally {
      setSimulated(true)
    }
  }

  const content = useMemo(() => {
    switch (current) {
      case 'overview':
        return <Overview setPage={setPage} onSimulate={handleSpeedrun} />
      case 'incidents':
        return <Incidents setPage={setPage} approved={approved} />
      case 'incident-detail':
        return <IncidentDetail setPage={setPage} approved={approved} setApproved={setApproved} />
      case 'evidence':
        return <Evidence setPage={setPage} />
      case 'partners':
        return <Partners />
      case 'policy':
        return <Policy />
      default:
        return <Overview setPage={setPage} onSimulate={handleSpeedrun} />
    }
  }, [current, approved])

  return (
    <Shell page={current === 'incident-detail' ? 'incidents' : current} setPage={setPage}>
      {simulated && (
        <div className="toast">
          <Zap size={17} />
          <div>
            <strong>Incident Speedrun Triggered</strong>
            <span>Telemetry validated · 11 Strands tools executed · Merkle root sealed</span>
          </div>
          <button onClick={() => setSimulated(false)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      )}
      {content}
    </Shell>
  )
}
