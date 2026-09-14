"""Telemetry aggregator and sustained-window evaluator."""

from datetime import datetime, timedelta
from typing import List, Optional
from perishlock.telemetry.models import ValidatedSample, WindowEvaluation


class TelemetryAggregator:
    """Evaluates time-series telemetry against parametric policy criteria."""

    def __init__(
        self,
        threshold_c: float = 13.0,
        required_sustained_minutes: float = 240.0,
    ):
        self.threshold_c = threshold_c
        self.required_sustained_minutes = required_sustained_minutes

    def evaluate_window(
        self,
        samples: List[ValidatedSample],
        target_time: Optional[datetime] = None,
    ) -> WindowEvaluation:
        """Evaluate whether a sustained temperature breach has occurred up to target_time."""
        valid_samples = [
            s for s in samples
            if s.status in ("VALID", "DRIFT_WARNING")
        ]
        valid_samples.sort(key=lambda s: s.timestamp)

        if not valid_samples:
            now = target_time or datetime.utcnow()
            return WindowEvaluation(
                chamber_id="UNKNOWN",
                evaluated_at=now,
                window_start=now,
                window_end=now,
                duration_minutes=0.0,
                sample_count=0,
                mean_temp_c=0.0,
                max_temp_c=0.0,
                min_temp_c=0.0,
                threshold_c=self.threshold_c,
                continuous_breach_minutes=0.0,
                is_sustained_breach=False,
                status_summary="No valid telemetry samples to evaluate."
            )

        chamber_id = valid_samples[0].chamber_id
        eval_time = target_time or valid_samples[-1].timestamp
        window_start = valid_samples[0].timestamp
        window_end = valid_samples[-1].timestamp
        total_duration_mins = max(0.0, (window_end - window_start).total_seconds() / 60.0)

        # Track continuous breach duration ending at the latest samples
        # Working backwards from the latest sample to find the continuous period above threshold
        continuous_breach_mins = 0.0
        breach_start_idx = None

        # Calculate continuous breach duration
        current_streak_start = None
        max_streak_mins = 0.0
        
        for i, s in enumerate(valid_samples):
            if s.effective_temperature_c > self.threshold_c:
                if current_streak_start is None:
                    current_streak_start = s.timestamp
                streak_mins = (s.timestamp - current_streak_start).total_seconds() / 60.0
                if streak_mins > max_streak_mins:
                    max_streak_mins = streak_mins
            else:
                current_streak_start = None

        # Check if the breach is active at the end of the window
        active_streak_mins = 0.0
        if current_streak_start is not None:
            active_streak_mins = (valid_samples[-1].timestamp - current_streak_start).total_seconds() / 60.0

        continuous_breach_mins = max(max_streak_mins, active_streak_mins)
        is_breach = continuous_breach_mins >= self.required_sustained_minutes

        temps = [s.effective_temperature_c for s in valid_samples]
        mean_t = round(sum(temps) / len(temps), 2)
        max_t = round(max(temps), 2)
        min_t = round(min(temps), 2)

        summary = (
            f"PARAMETRIC BREACH DETECTED: Chamber temperature exceeded {self.threshold_c}C "
            f"for {continuous_breach_mins:.1f} continuous minutes (limit: {self.required_sustained_minutes}m). "
            f"Peak: {max_t}C, Mean: {mean_t}C."
            if is_breach else
            f"STABLE: Maximum continuous breach was {continuous_breach_mins:.1f} minutes "
            f"(threshold: {self.required_sustained_minutes}m). Mean: {mean_t}C."
        )

        return WindowEvaluation(
            chamber_id=chamber_id,
            evaluated_at=eval_time,
            window_start=window_start,
            window_end=window_end,
            duration_minutes=round(total_duration_mins, 1),
            sample_count=len(valid_samples),
            mean_temp_c=mean_t,
            max_temp_c=max_t,
            min_temp_c=min_t,
            threshold_c=self.threshold_c,
            continuous_breach_minutes=round(continuous_breach_mins, 1),
            is_sustained_breach=is_breach,
            status_summary=summary
        )
