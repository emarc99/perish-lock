import {
  ChamberStatus,
  TelemetryPoint,
  SalvageOption,
  SettlementClaim,
  EvidenceManifest,
  AgentStep,
} from "./types";

export const MOCK_STATUS: ChamberStatus = {
  status: "BREACH_ACTIVE",
  chamber_id: "CHAMBER-A-NORTH",
  active_incident_id: "INC-POL-RB-TOM-2026-001",
  incident_state: "BREACH_TRIGGERED",
  latest_temperature_c: 15.8,
  peak_temperature_c: 18.2,
  target_temperature_range: "10.0°C - 12.5°C",
  commodity: "Fresh Roma Tomatoes (US No. 1)",
  quantity_kg: 14200,
  lot_number: "LOT-SALINAS-2026-09A",
  insured_value_usd: 9230.0,
  sample_count: 40,
};

export const MOCK_TELEMETRY: TelemetryPoint[] = [
  { timestamp: "2026-09-14T12:00:00Z", temperature_c: 11.2, humidity_pct: 88.5, drift_c: 0.2, status: "VALID" },
  { timestamp: "2026-09-14T12:30:00Z", temperature_c: 11.4, humidity_pct: 87.9, drift_c: 0.1, status: "VALID" },
  { timestamp: "2026-09-14T13:00:00Z", temperature_c: 11.8, humidity_pct: 86.2, drift_c: 0.3, status: "VALID" },
  { timestamp: "2026-09-14T13:30:00Z", temperature_c: 12.3, humidity_pct: 85.1, drift_c: 0.2, status: "VALID" },
  { timestamp: "2026-09-14T14:00:00Z", temperature_c: 13.2, humidity_pct: 84.0, drift_c: 0.4, status: "BREACH" },
  { timestamp: "2026-09-14T14:30:00Z", temperature_c: 13.9, humidity_pct: 82.5, drift_c: 0.5, status: "BREACH" },
  { timestamp: "2026-09-14T15:00:00Z", temperature_c: 14.5, humidity_pct: 80.1, drift_c: 0.3, status: "BREACH" },
  { timestamp: "2026-09-14T15:30:00Z", temperature_c: 15.3, humidity_pct: 78.4, drift_c: 0.6, status: "BREACH" },
  { timestamp: "2026-09-14T16:00:00Z", temperature_c: 16.2, humidity_pct: 76.8, drift_c: 0.4, status: "BREACH" },
  { timestamp: "2026-09-14T16:30:00Z", temperature_c: 17.1, humidity_pct: 75.2, drift_c: 0.5, status: "BREACH" },
  { timestamp: "2026-09-14T17:00:00Z", temperature_c: 17.8, humidity_pct: 73.9, drift_c: 0.7, status: "BREACH" },
  { timestamp: "2026-09-14T17:30:00Z", temperature_c: 18.2, humidity_pct: 72.5, drift_c: 0.6, status: "BREACH" },
  { timestamp: "2026-09-14T18:00:00Z", temperature_c: 17.6, humidity_pct: 73.1, drift_c: 0.5, status: "BREACH" },
  { timestamp: "2026-09-14T18:30:00Z", temperature_c: 16.9, humidity_pct: 74.0, drift_c: 0.4, status: "BREACH" },
  { timestamp: "2026-09-14T19:00:00Z", temperature_c: 16.2, humidity_pct: 75.0, drift_c: 0.3, status: "BREACH" },
  { timestamp: "2026-09-14T19:30:00Z", temperature_c: 15.8, humidity_pct: 76.2, drift_c: 0.3, status: "BREACH" },
];

export const MOCK_OPTIONS: SalvageOption[] = [
  {
    option_id: "OPT-A-FINANCIAL-MAX",
    strategy_name: "Option A: Maximum Financial Recovery (Dual Processor Route)",
    description: "Splits volume between Valley Fresh Cannery and SunCoast Dehydrators to maximize cash return while respecting shift intake limits.",
    total_salvaged_kg: 14000,
    total_net_recovery_usd: 4459.52,
    value_retention_pct: 48.3,
    unallocated_kg: 200,
    social_impact_description: "Direct commercial salvage into local food processing channels preventing commercial total loss.",
    coordinator_recommended: true,
    allocations: [
      { partner_name: "Valley Fresh Cannery & Paste", allocated_quantity_kg: 8000, net_recovery_usd: 2781.9, distance_km: 42, transit_time_hrs: 0.8 },
      { partner_name: "SunCoast Dehydrators & Sun-Dried Co.", allocated_quantity_kg: 6000, net_recovery_usd: 1677.62, distance_km: 78, transit_time_hrs: 1.4 },
    ],
  },
  {
    option_id: "OPT-B-SOCIAL-RAPID",
    strategy_name: "Option B: Rapid Relief & Community Food Rescue",
    description: "Prioritizes immediate evacuation to Hope Community Food Rescue for same-day family distribution boxes, routing remainder to Valley Fresh.",
    total_salvaged_kg: 12500,
    total_net_recovery_usd: 3237.85,
    value_retention_pct: 35.1,
    unallocated_kg: 1700,
    social_impact_description: "4.5 tons of fresh Roma tomatoes delivered directly to community food relief, feeding 1,800 local families.",
    coordinator_recommended: false,
    allocations: [
      { partner_name: "Hope Community Food Rescue", allocated_quantity_kg: 4500, net_recovery_usd: 455.95, distance_km: 18, transit_time_hrs: 0.4 },
      { partner_name: "Valley Fresh Cannery & Paste", allocated_quantity_kg: 8000, net_recovery_usd: 2781.9, distance_km: 42, transit_time_hrs: 0.8 },
    ],
  },
];

export const MOCK_SETTLEMENT: SettlementClaim = {
  contracted_asset_value_usd: 9230.0,
  salvage_recovery_usd: 4459.52,
  yield_gap_loss_usd: 4770.48,
  parametric_payout_usd: 4309.48,
  total_farmer_realization_usd: 8768.5,
  total_farmer_realization_pct: 95.0,
  coverage_cap_usd: 9200.0,
  claim_id: "CLM-POL-RB-TOM-2026-001",
  status: "INDEMNITY_CALCULATED",
};

export const MOCK_MANIFEST: EvidenceManifest = {
  manifest_id: "MAN-INC-HASH-A-cea96685",
  incident_id: "INC-POL-RB-TOM-2026-001",
  created_at: "2026-09-14T17:30:00Z",
  sha256_merkle_root: "a7b3c9e5d1f408726830de4ab91c5f62e8d70a3b4c1e9f52d684b0a7312e6f88",
  tamper_evident: true,
  components: [
    { name: "telemetry_timeseries", item_count: 40, sha256_hash: "17ee9028857b6d43552934cddb4ca915b84f8f6b4ff3a3ed6a374dfc7ae9dd7b" },
    { name: "trigger_evaluation", item_count: 1, sha256_hash: "9d4c3db00403b18f0845f7472492f4c295ae9f5f8d3902140e9ed5804a271129" },
    { name: "partner_intake_quotes", item_count: 5, sha256_hash: "4e9b81f3d2a7049683b2cf51e4a60d9238c92a47e6d0a7312e6f88b5c8d3f2a1" },
    { name: "agent_cognitive_traces", item_count: 11, sha256_hash: "8f1a3c6d9b2475034e8d1c6a9f3b720e7b3c9e5d1f408726830de4ab91c5f62e" },
  ],
};

export const MOCK_AGENT_STEPS: AgentStep[] = [
  { step: "load_incident_scope", tool: "load_incident_scope", status: "success", detail: "Loaded policy POL-RB-TOM-001 ($9,230 limit, 14,200 kg Roma Tomatoes)" },
  { step: "get_sensor_evidence", tool: "get_sensor_evidence", status: "success", detail: "Ingested 40 dual-sensor readings (AHT20 + SHT31). Drift within 0.7°C (≤ 1.5°C threshold)" },
  { step: "get_trigger_evaluation", tool: "get_trigger_evaluation", status: "success", detail: "Parametric threshold confirmed: sustained >13.0°C for 255 min (≥ 240 min policy threshold)" },
  { step: "get_weather_context", tool: "get_weather_context", status: "success", detail: "Ambient temperature: 31.5°C, RH 42%. Grid alert confirmed (local transformer surge)" },
  { step: "find_eligible_partners", tool: "find_eligible_partners", status: "success", detail: "Discovered 5 regional partners: 2 canneries, 1 dehydrator, 1 cold hub, 1 food rescue" },
  { step: "calculate_route_matrix", tool: "calculate_route_matrix", status: "success", detail: "Computed reefer transit matrices (18km to 78km, avg transit 0.9 hours)" },
  { step: "prepare_response_options", tool: "prepare_response_options", status: "success", detail: "Synthesized Option A (Commercial Maximum) and Option B (Community Relief)" },
  { step: "seal_incident_packet", tool: "seal_incident_packet", status: "success", detail: "Merkle tree root sealed: a7b3c9e5d1f40872... (AWS S3 Object Lock compliant)" },
  { step: "draft_claim_notice", tool: "draft_claim_notice", status: "success", detail: "Yield-gap indemnity computed: $4,309.48. Farmer net realization: 95.0% ($8,768.50)" },
  { step: "request_coordinator_approval", tool: "request_coordinator_approval", status: "success", detail: "Issued single-use HMAC token. Execution paused behind Human-in-the-Loop gate." },
];
