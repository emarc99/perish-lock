# 🎬 PerishLock — 2-Minute Demo Video Script

**Target Duration**: 1 minute 50 seconds to 2 minutes 00 seconds  
**Format**: Screen recording of browser at `http://localhost:3000/` + Voiceover  
**Prerequisites**: Both servers running (`python -m perishlock.api.server` and Next.js on port 3000)

---

### ⏱️ Timeline & Step-by-Step Script

| Time | Page & Screen Action | Spoken Voiceover |
|---|---|---|
| **0:00 – 0:20**<br>(20s) | **Scene 1: Root Landing Page (`/`)**<br>• Show `http://localhost:3000/`.<br>• Hover cursor over the live incident preview console in the hero section. | *"Welcome to PerishLock. This is our public landing page, designed to give cooperative stakeholders an executive view of cold-chain incidents.<br><br>Right now, Chamber CR-4 at Salinas Valley Cooperative has breached safety limits: 14,200 kg of fresh Roma tomatoes worth $9,230 are sitting above 13°C. If they spoil, farmers take a 100% loss. PerishLock steps in with autonomous cold-chain defense."* |
| **0:20 – 0:35**<br>(15s) | **Scene 2: Build Story & Architecture (`/article`)**<br>• Click **"Read the build story"** in the hero.<br>• Scroll down to the architecture section. | *"Our project article details the AWS architecture. We combine dual IoT sensor validation with the AWS Strands Agents SDK, episodic memory deployed live in Amazon Bedrock AgentCore in us-east-1, and an immutable SHA-256 Merkle evidence vault.<br><br>Now, let's step into the operational cockpit."* |
| **0:35 – 0:50**<br>(15s) | **Scene 3: Mission Control Overview (`/mission-control`)**<br>• Click **"Mission control"** in the top navigation.<br>• Show the 4 KPI cards and temperature telemetry curve.<br>• Click **"Review incident"** on the warning banner. | *"This is Mission Control—the daily cockpit for the cold-room coordinator. The telemetry card confirms a sustained breach: 15.8°C for 255 consecutive minutes with zero sensor drift.<br><br>I'll click 'Review incident' to enter the decision console."* |
| **0:50 – 1:25**<br>(35s) | **Scene 4: Incident Detail & Human Authorization**<br>• Point to the 3 cooperative member lots ($9,230 contracted value).<br>• Point to **Option A** (Commercial Max: $4,459 net salvage).<br>• Click **Option B** (Community Rescue: 4.5 tons to Hope Food Bank).<br>• In the right sidebar, point to the single-use token `sec-tok-salinas-99a2c1`.<br>• Click **"Authorize & Dispatch Salvage Carrier"**.<br>• Show the status turn to **`Carrier Dispatched (Token Consumed)`**. | *"Here in the console, 3 member lots are at risk. The Strands Agent synthesized two operational options:<br>• Option A: Max financial salvage.<br>• Option B: Community rescue—diverting 4.5 tons to Hope Food Bank to feed 1,800 families.<br><br>Crucially, the agent cannot move trucks on its own. It pauses behind this Human-in-the-Loop gate. I select Option B and click 'Authorize'. The single-use token burns instantly to block replay attacks, and dispatch is executed."* |
| **1:25 – 1:45**<br>(20s) | **Scene 5: Evidence Vault & Strands Agent Trace**<br>• Click **"Evidence vault"** in the left sidebar.<br>• Click the **"Strands Agent Trace 11"** tab in the center.<br>• Click back to the **"Artifacts 14"** tab. | *"In the Evidence Vault, we inspect the exact audit trail:<br>Under 'Strands Agent Trace', we see each tool executed by the agent: loading scope, ingesting 40 dual-sensor samples, evaluating trigger thresholds, and calculating reefer route matrices.<br><br>All 14 artifacts are sealed into this SHA-256 Merkle root hash for instant, zero-delay insurance settlement."* |
| **1:45 – 2:00**<br>(15s) | **Scene 6: Partner Network & Closing**<br>• Click **"Partner network"** in the left sidebar.<br>• Show Pacific Canning Co. and Hope Community Food Bank cards. | *"Under Partner Network, we see the real dock capacities that made this possible.<br><br>In under 5 minutes, PerishLock turned a catastrophic 14-ton food loss into a 95% value recovery for farmers—keeping humans firmly in control. Thank you."* |

---

### 🎙️ Recording Checklist

1. **Browser State**: Open `http://localhost:3000/` in full-screen or 1920x1080 resolution.
2. **Tab Flow**:
   - Start: `http://localhost:3000/` (Landing page)
   - Click: "Read the build story" (`/article`)
   - Click: "Mission control" (`/mission-control`)
   - Click: "Review incident" (opens Incident Detail)
   - Click: Option B, then click "Authorize & Dispatch Salvage Carrier"
   - Click: "Evidence vault" in sidebar $\rightarrow$ click "Strands Agent Trace 11" tab
   - Click: "Partner network" in sidebar
3. **Screen Recording Tools**:
   - **Windows Game Bar**: Press `Win + Alt + R` to start/stop recording.
   - **Loom**: Instant link and auto-upload.
   - **OBS Studio**: Clean 1080p recording.
