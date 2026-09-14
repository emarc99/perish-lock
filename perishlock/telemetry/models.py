"""Telemetry data models for PerishLock."""

from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field


class SensorReading(BaseModel):
    """Raw reading from a physical sensor node."""
    temperature_c: float = Field(..., description="Temperature in Celsius")
    relative_humidity_pct: float = Field(..., ge=0.0, le=100.0, description="Relative humidity percentage")
    battery_pct: Optional[float] = Field(None, ge=0.0, le=100.0, description="Sensor node battery percentage")


class ChamberReading(BaseModel):
    """Dual-sensor reading packet from a cold chamber."""
    timestamp: datetime = Field(..., description="UTC ISO-8601 timestamp of measurement")
    chamber_id: str = Field(..., description="Identifier of the cold storage chamber")
    sensor_1: SensorReading = Field(..., description="Primary sensor reading")
    sensor_2: SensorReading = Field(..., description="Secondary verification sensor reading")
    grid_powered: bool = Field(True, description="Whether grid mains power is active")
    compressor_active: bool = Field(True, description="Whether cooling compressor is currently running")


class ValidatedSample(BaseModel):
    """Validated, calibrated observation derived from dual-sensor consensus."""
    timestamp: datetime
    chamber_id: str
    effective_temperature_c: float
    effective_humidity_pct: float
    drift_c: float
    status: Literal["VALID", "DRIFT_WARNING", "REJECTED_OUT_OF_BOUNDS", "REJECTED_SENSOR_FAULT"]
    error_detail: Optional[str] = None


class WindowEvaluation(BaseModel):
    """Sustained temperature window evaluation result."""
    chamber_id: str
    evaluated_at: datetime
    window_start: datetime
    window_end: datetime
    duration_minutes: float
    sample_count: int
    mean_temp_c: float
    max_temp_c: float
    min_temp_c: float
    threshold_c: float
    continuous_breach_minutes: float
    is_sustained_breach: bool
    status_summary: str
