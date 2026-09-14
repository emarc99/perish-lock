"use client";

import React, { useState } from "react";
import { KeyRound, ShieldAlert, CheckCircle2, Lock, ArrowRight, FileSignature } from "lucide-react";

interface HITLApprovalGateProps {
  requestId: string;
  token: string;
  selectedOptionId: string;
  onAuthorize: (notes: string) => Promise<boolean>;
  isAuthorized: boolean;
}

export const HITLApprovalGate: React.FC<HITLApprovalGateProps> = ({
  requestId,
  token,
  selectedOptionId,
  onAuthorize,
  isAuthorized,
}) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAuthorize(notes);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            Human-in-the-Loop Governance Gate (Anti-Replay Cryptographic Token)
          </h2>
          <p className="text-xs text-slate-400">
            Carrier dispatch & parametric indemnity payout requires single-use coordinator authorization
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {isAuthorized ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              TOKEN CONSUMED & DISPATCHED
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              PAUSED AWAITING APPROVAL
            </span>
          )}
        </div>
      </div>

      {isAuthorized ? (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-center py-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">Salvage Dispatch Authorized</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Token consumed successfully. Reefer carriers notified and routing instructions issued for{" "}
            <span className="text-emerald-400 font-semibold">{selectedOptionId}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block mb-1">Approval Request ID:</span>
              <code className="font-mono text-cyan-300 text-xs">{requestId}</code>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block mb-1">Single-Use HMAC Token:</span>
              <code className="font-mono text-amber-300 text-xs truncate block">{token}</code>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileSignature className="w-3.5 h-3.5 text-slate-400" />
              Cooperative Coordinator Notes (Optional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Approved shift B intake with Valley Fresh dock manager."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Token expires in 60 minutes. Single-use only.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-slate-950">⏳</span>
                  Consuming Token...
                </>
              ) : (
                <>
                  Authorize Salvage Dispatch
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
