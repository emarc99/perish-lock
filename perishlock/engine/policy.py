"""Commodity profile and insurance policy models."""

import json
from pathlib import Path
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class StorageThresholds(BaseModel):
    optimal_min_temp_c: float
    optimal_max_temp_c: float
    chilling_injury_threshold_c: float
    accelerated_rot_threshold_c: float
    critical_failure_threshold_c: float
    optimal_min_rh_pct: float
    optimal_max_rh_pct: float


class ParametricTriggerSpec(BaseModel):
    breach_metric: str
    threshold_value: float
    comparison: str
    sustained_duration_minutes: float
    dual_sensor_max_drift_c: float
    coverage_cap_usd: float
    deductible_pct: float


class CommoditySpec(BaseModel):
    name: str
    scientific_name: str
    harvest_date: str
    intake_date: str
    lot_number: str
    quantity_kg: float
    crate_count: int
    crate_weight_kg: float
    initial_grade: str
    base_market_price_per_kg: float
    total_insured_value_usd: float


class PolicyModel(BaseModel):
    policy_id: str
    policy_holder: str
    facility_id: str
    chamber_id: str
    location: Dict[str, Any]
    commodity: CommoditySpec
    storage_thresholds: StorageThresholds
    parametric_trigger: ParametricTriggerSpec
    coordinator: Dict[str, str]

    @classmethod
    def load_from_file(cls, path: str | Path) -> "PolicyModel":
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return cls(**data)
