"""Shelf-life decay mathematics and salvage allocation models for Roma tomatoes."""

import math
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class SalvageAllocationItem(BaseModel):
    partner_id: str
    partner_name: str
    category: str
    allocated_quantity_kg: float
    offered_price_per_kg: float
    gross_recovery_usd: float
    logistics_cost_usd: float
    net_recovery_usd: float
    transit_time_minutes: int
    intake_feasibility: str
    rationale: str


class SalvageOption(BaseModel):
    option_id: str
    strategy_name: str
    description: str
    allocations: List[SalvageAllocationItem]
    total_salvaged_kg: float
    total_net_recovery_usd: float
    value_retention_pct: float
    unallocated_kg: float
    food_waste_mitigation_kg: float
    social_impact_description: Optional[str] = None
    coordinator_recommended: bool = False


class SalvageCalculator:
    """Calculates shelf-life decay and optimal salvage allocations based on physical parameters."""

    @staticmethod
    def calculate_residual_shelf_life_hours(
        mean_temperature_c: float,
        hours_above_threshold: float,
        baseline_shelf_life_hours: float = 240.0,  # ~10 days for fresh green-wrap/light-red Roma at 11C
    ) -> float:
        """
        Model decay rate: Q10 temperature coefficient ~2.2 for post-harvest Solanaceae.
        Decay accelerates exponentially when above 12.5C.
        """
        temp_delta = max(0.0, mean_temperature_c - 11.5)
        # Decay acceleration factor
        acceleration = math.exp(0.18 * temp_delta)
        depleted_hours = hours_above_threshold * acceleration
        residual = max(4.0, baseline_shelf_life_hours - depleted_hours * 8.0)
        return round(residual, 1)

    @staticmethod
    def calculate_freight_cost(distance_km: float, is_reefer: bool = True) -> float:
        """Estimate refrigerated carrier freight cost."""
        base_fee = 180.0 if is_reefer else 100.0
        per_km = 2.75 if is_reefer else 1.80
        return round(base_fee + distance_km * per_km, 2)
