"""Deterministic telemetry validation and anomaly detection."""

from datetime import datetime
from typing import Optional, Tuple
from perishlock.telemetry.models import ChamberReading, ValidatedSample


class TelemetryValidator:
    """Deterministic validator enforcing cold-chain physical bounds and sensor integrity."""

    def __init__(
        self,
        min_valid_temp_c: float = -10.0,
        max_valid_temp_c: float = 55.0,
        max_sensor_drift_c: float = 1.5,
        fault_sensor_drift_c: float = 3.5,
    ):
        self.min_valid_temp_c = min_valid_temp_c
        self.max_valid_temp_c = max_valid_temp_c
        self.max_sensor_drift_c = max_sensor_drift_c
        self.fault_sensor_drift_c = fault_sensor_drift_c

    def validate_reading(self, reading: ChamberReading) -> ValidatedSample:
        """Validate raw dual-sensor reading and compute effective metrics."""
        t1 = reading.sensor_1.temperature_c
        t2 = reading.sensor_2.temperature_c
        h1 = reading.sensor_1.relative_humidity_pct
        h2 = reading.sensor_2.relative_humidity_pct

        # 1. Bounds check
        if not (self.min_valid_temp_c <= t1 <= self.max_valid_temp_c) or \
           not (self.min_valid_temp_c <= t2 <= self.max_valid_temp_c):
            return ValidatedSample(
                timestamp=reading.timestamp,
                chamber_id=reading.chamber_id,
                effective_temperature_c=t1 if self.min_valid_temp_c <= t1 <= self.max_valid_temp_c else t2,
                effective_humidity_pct=(h1 + h2) / 2.0,
                drift_c=abs(t1 - t2),
                status="REJECTED_OUT_OF_BOUNDS",
                error_detail=f"Sensor reading out of physical range [{self.min_valid_temp_c}, {self.max_valid_temp_c}]: s1={t1}C, s2={t2}C"
            )

        # 2. Sensor drift calculation
        drift = abs(t1 - t2)
        if drift > self.fault_sensor_drift_c:
            return ValidatedSample(
                timestamp=reading.timestamp,
                chamber_id=reading.chamber_id,
                effective_temperature_c=(t1 + t2) / 2.0,
                effective_humidity_pct=(h1 + h2) / 2.0,
                drift_c=drift,
                status="REJECTED_SENSOR_FAULT",
                error_detail=f"Severe sensor disagreement {drift:.2f}C exceeds fault limit {self.fault_sensor_drift_c:.2f}C"
            )

        status = "DRIFT_WARNING" if drift > self.max_sensor_drift_c else "VALID"
        err = f"Sensors drifted by {drift:.2f}C (threshold: {self.max_sensor_drift_c}C)" if status == "DRIFT_WARNING" else None

        effective_temp = round((t1 + t2) / 2.0, 2)
        effective_rh = round((h1 + h2) / 2.0, 1)

        return ValidatedSample(
            timestamp=reading.timestamp,
            chamber_id=reading.chamber_id,
            effective_temperature_c=effective_temp,
            effective_humidity_pct=effective_rh,
            drift_c=round(drift, 2),
            status=status,
            error_detail=err
        )
