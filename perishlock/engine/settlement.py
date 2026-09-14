"""Parametric yield gap loss calculation and sandbox claim notice."""

from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from perishlock.engine.policy import PolicyModel
from perishlock.engine.salvage import SalvageOption


class SettlementNotice(BaseModel):
    claim_id: str
    incident_id: str
    policy_id: str
    beneficiary: str
    lot_number: str
    commodity: str
    quantity_kg: float
    contracted_asset_value_usd: float
    salvage_recovery_usd: float
    yield_gap_loss_usd: float
    deductible_usd: float
    coverage_cap_usd: float
    parametric_payout_usd: float
    total_farmer_realization_usd: float
    total_farmer_realization_pct: float
    issued_at: datetime
    sandbox_mode: bool = True
    evidence_manifest_hash: Optional[str] = None


class SettlementCalculator:
    """Computes exact parametric loss and indemnity based on contracted parameters."""

    @staticmethod
    def calculate_claim(
        incident_id: str,
        policy: PolicyModel,
        chosen_option: SalvageOption,
        evidence_manifest_hash: Optional[str] = None,
    ) -> SettlementNotice:
        claim_id = f"CLM-{incident_id.replace('INC-', '')}-01"
        contracted_val = policy.commodity.total_insured_value_usd
        salvage_recovery = max(0.0, chosen_option.total_net_recovery_usd)
        yield_gap_loss = max(0.0, contracted_val - salvage_recovery)

        deductible_amt = round(contracted_val * (policy.parametric_trigger.deductible_pct / 100.0), 2)
        insurable_loss = max(0.0, yield_gap_loss - deductible_amt)
        payout = min(policy.parametric_trigger.coverage_cap_usd, round(insurable_loss, 2))

        farmer_realization = round(salvage_recovery + payout, 2)
        realization_pct = round((farmer_realization / contracted_val) * 100.0, 1)

        return SettlementNotice(
            claim_id=claim_id,
            incident_id=incident_id,
            policy_id=policy.policy_id,
            beneficiary=policy.policy_holder,
            lot_number=policy.commodity.lot_number,
            commodity=policy.commodity.name,
            quantity_kg=policy.commodity.quantity_kg,
            contracted_asset_value_usd=contracted_val,
            salvage_recovery_usd=salvage_recovery,
            yield_gap_loss_usd=round(yield_gap_loss, 2),
            deductible_usd=deductible_amt,
            coverage_cap_usd=policy.parametric_trigger.coverage_cap_usd,
            parametric_payout_usd=payout,
            total_farmer_realization_usd=farmer_realization,
            total_farmer_realization_pct=realization_pct,
            issued_at=datetime.utcnow(),
            sandbox_mode=True,
            evidence_manifest_hash=evidence_manifest_hash
        )
