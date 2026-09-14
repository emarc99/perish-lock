"use client";

import React from "react";
import { SettlementClaim } from "@/lib/types";
import { Scale, CheckCircle2, DollarSign } from "lucide-react";

interface SettlementSummaryProps {
  settlement: SettlementClaim | null;
}

export const SettlementSummary: React.FC<SettlementSummaryProps> = ({ settlement }) => {
  if (!settlement) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            Parametric Yield-Gap Indemnification (Actuarial Settlement)
          </h2>
          <p className="text-xs text-slate-400">
            Zero-adjuster parametric payout automatically closing the farmer financial deficit
          </p>
        </div>
        <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md font-semibold">
          95.0% Value Realized
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Contract Value</span>
          <span className="text-sm font-bold text-slate-200">
            ${settlement.contracted_asset_value_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">14,200 kg @ $0.65/kg</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Gross Salvage Cash</span>
          <span className="text-sm font-bold text-cyan-400">
            +${settlement.salvage_recovery_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Dual-processor intake</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">Parametric Payout</span>
          <span className="text-sm font-bold text-emerald-400">
            +${settlement.parametric_payout_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Yield-gap indemnity</span>
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-950/80 border border-emerald-500/30 shadow-md shadow-emerald-500/5">
          <span className="text-[11px] text-emerald-300 font-semibold block mb-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            Net Farmer Realization
          </span>
          <span className="text-sm font-bold text-white">
            ${settlement.total_farmer_realization_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {settlement.total_farmer_realization_pct}% Realized (vs 0% total loss)
          </span>
        </div>
      </div>
    </div>
  );
};
