"use strict";
import React from "react";
import { Shield, AlertTriangle, Cloud, Activity, CheckCircle2 } from "lucide-react";
import { ChamberStatus } from "@/lib/types";

interface HeaderProps {
  status: ChamberStatus | null;
  isRunningAgent: boolean;
  onRunAgent: () => void;
}

export const Header: React.FC<HeaderProps> = ({ status, isRunningAgent, onRunAgent }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand & Incident Tag */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                PerishLock <span className="text-cyan-400 font-semibold">Mission Control</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                ACTIVE DEFENSE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous Cold-Chain Defense • AWS Strands SDK & Bedrock AgentCore
            </p>
          </div>
        </div>

        {/* Live Metrics Quick View */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Cloud className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Chamber:</span>
            <span className="font-semibold text-slate-200">{status?.chamber_id || "CHAMBER-A"}</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Breach Temp:</span>
            <span className="font-bold text-rose-400">
              {status ? `${status.latest_temperature_c}°C` : "15.8°C"}
            </span>
          </div>

          <button
            onClick={onRunAgent}
            disabled={isRunningAgent}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg font-semibold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold"
          >
            {isRunningAgent ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin text-slate-950" />
                Reasoning in Progress...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                Run Strands Agent Speedrun
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
