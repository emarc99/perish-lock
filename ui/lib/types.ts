export interface ChamberStatus {
  status: "ONLINE" | "BREACH_ACTIVE" | "DISPATCHED" | "OFFLINE";
  chamber_id: string;
  active_incident_id: string;
  incident_state: string;
  latest_temperature_c: number;
  peak_temperature_c: number;
  target_temperature_range: string;
  commodity: string;
  quantity_kg: number;
  lot_number: string;
  insured_value_usd: number;
  sample_count: number;
}

export interface TelemetryPoint {
  timestamp: string;
  temperature_c: number;
  humidity_pct: number;
  drift_c: number;
  status: "VALID" | "DRIFT_WARNING" | "CORRUPTED" | "BREACH";
}

export interface PartnerAllocation {
  partner_name: string;
  allocated_quantity_kg: number;
  net_recovery_usd: number;
  distance_km?: number;
  transit_time_hrs?: number;
}

export interface SalvageOption {
  option_id: string;
  strategy_name: string;
  description: string;
  total_salvaged_kg: number;
  total_net_recovery_usd: number;
  value_retention_pct: number;
  unallocated_kg: number;
  social_impact_description: string;
  coordinator_recommended: boolean;
  allocations: PartnerAllocation[];
}

export interface SettlementClaim {
  contracted_asset_value_usd: number;
  salvage_recovery_usd: number;
  yield_gap_loss_usd: number;
  parametric_payout_usd: number;
  total_farmer_realization_usd: number;
  total_farmer_realization_pct: number;
  coverage_cap_usd: number;
  claim_id?: string;
  status?: string;
}

export interface ManifestComponent {
  name: string;
  item_count: number;
  sha256_hash: string;
  metadata?: Record<string, unknown>;
}

export interface EvidenceManifest {
  manifest_id: string;
  incident_id: string;
  created_at: string;
  sha256_merkle_root: string;
  components: ManifestComponent[];
  tamper_evident: boolean;
}

export interface AgentStep {
  step: string;
  tool?: string;
  status: "success" | "warning" | "error" | "intercepted";
  timestamp?: string;
  detail?: string;
  data?: unknown;
}

export interface ApprovalRequest {
  request_id: string;
  incident_id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  raw_approval_token: string;
  approval_url: string;
  allowed_option_ids: string[];
  expires_at?: string;
}
