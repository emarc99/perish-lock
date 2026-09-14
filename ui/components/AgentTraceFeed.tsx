"use client";

import React from "react";
import { AgentStep } from "@/lib/types";
import { Terminal, CheckCircle2, AlertCircle, ShieldAlert, Cpu } from "lucide-react";

interface AgentTraceFeedProps {
  steps: AgentStep[];
  isRunning: boolean;
}

export const AgentTraceFeed: React.FC<AgentTraceFeedProps> = ({ steps, isRunning }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white">Strands Agent Execution Trace</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>AWS Strands SDK (11 Typed Tools)</span>
        </div>
      </div>

      <div className="space-y-2.5 overflow-y-auto max-h-80 pr-1 flex-1 font-mono text-xs">
        {steps.length === 0 && !isRunning && (
          <div className="py-12 text-center text-slate-400">
            <p>Click &quot;Run Strands Agent Speedrun&quot; to observe the autonomous reasoning loop.</p>
          </div>
        )}

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 transition-all hover:border-slate-700/80 flex items-start gap-2.5"
          >
            <div className="mt-0.5">
              {step.status === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              {step.status === "warning" && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
              {step.status === "intercepted" && <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-cyan-300 truncate">
                  {step.tool || step.step}()
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">
                  Step {idx + 1}
                </span>
              </div>
              {step.detail && <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">{step.detail}</p>}
            </div>
          </div>
        ))}

        {isRunning && (
          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 animate-pulse text-cyan-400 text-xs flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Executing Bedrock inference reasoning loop...
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Lifecycle Hooks: RateLimiterHook, ColdRoomSafetyHook</span>
        <span className="text-emerald-400 font-semibold">Steering: Active</span>
      </div>
    </div>
  );
};
