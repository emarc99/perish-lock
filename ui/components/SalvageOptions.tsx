"use client";

import React from "react";
import { SalvageOption } from "@/lib/types";
import { DollarSign, Users, Truck, Check, Award } from "lucide-react";

interface SalvageOptionsProps {
  options: SalvageOption[];
  selectedOptionId: string;
  onSelectOption: (id: string) => void;
}

export const SalvageOptions: React.FC<SalvageOptionsProps> = ({
  options,
  selectedOptionId,
  onSelectOption,
}) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            Synthesized Salvage Strategies (Multi-Destination Routing)
          </h2>
          <p className="text-xs text-slate-400">
            Reconciled from semi-structured processor notes, shift dock limits, and decay kinetics
          </p>
        </div>
        <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
          2 Contrasting Options Generated
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.option_id;

          return (
            <div
              key={opt.option_id}
              onClick={() => onSelectOption(opt.option_id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {opt.coordinator_recommended && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <Award className="w-3 h-3" />
                  RECOMMENDED STRATEGY
                </div>
              )}

              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {opt.strategy_name}
                  </h3>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-cyan-500 border-cyan-500 text-slate-950"
                        : "border-slate-700 text-transparent"
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {opt.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 mb-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Salvaged</span>
                    <span className="font-semibold text-slate-200">
                      {(opt.total_salvaged_kg / 1000).toFixed(1)} tons
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gross Salvage</span>
                    <span className="font-semibold text-emerald-400">
                      ${opt.total_net_recovery_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Value Retention</span>
                    <span className="font-semibold text-cyan-400">
                      {opt.value_retention_pct}%
                    </span>
                  </div>
                </div>

                {/* Allocations breakdown */}
                <div className="space-y-1.5 mb-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Dispatch Allocations:
                  </span>
                  {opt.allocations.map((alloc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-950/40 border border-slate-800/60"
                    >
                      <span className="text-slate-300 font-medium truncate max-w-[180px]">
                        {alloc.partner_name}
                      </span>
                      <span className="text-slate-400">
                        {alloc.allocated_quantity_kg.toLocaleString()} kg •{" "}
                        <span className="text-emerald-400 font-semibold">
                          ${alloc.net_recovery_usd.toFixed(0)}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Impact Note */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
                {opt.option_id === "OPT-A-FINANCIAL-MAX" ? (
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                )}
                <span className="text-[11px] leading-snug">{opt.social_impact_description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
