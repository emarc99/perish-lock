# Agents for Humans: How We Built PerishLock with AWS Strands & Bedrock AgentCore

*By the PerishLock Team | Submitted to the AWS Agents for Humans Hackathon 2026 (Good Neighbor Track)*

---

## 🌾 The Problem: When 4 Hours Destroys a Harvest

In the agricultural heartland of Salinas Valley, smallholder farmer cooperatives store their freshly harvested produce in community cold-storage chambers before distribution. 

At 14:00 on a sweltering Tuesday, a power glitch trips the secondary compressor in Cold Room 4. Inside sit **14,200 kg of premium Roma tomatoes** worth $9,230. The internal temperature begins climbing from its safe 11.5°C up toward 18.5°C.

For perishable commodities like tomatoes, this is a death sentence. Within **4 hours above 13.0°C**, post-harvest decay accelerates exponentially. Bacterial soft rot sets in, skins soften, and market value plummets toward zero.

In the traditional world:
- The breach is discovered hours or days later.
- An insurance adjuster takes 3 to 6 weeks to inspect the spoiled produce.
- Disagreements arise over whether the failure was mechanical or negligence.
- 14 tons of edible food end up in a landfill, and smallholder farmers bear devastating losses.

We asked: **What if an autonomous AI agent could monitor the cold room, verify the breach with zero human delay, calculate multi-destination salvage logistics in seconds, and pause execution behind a cryptographic Human-in-the-Loop gate so the cooperative manager retains complete control?**

That is why we built **PerishLock**.

---

## 🏗️ The System Architecture

![PerishLock AWS Official Architecture Diagram](assets/architecture_diagram_aws_format.png)

PerishLock is built on the **AWS Strands Agents SDK** and deployed via **Amazon Bedrock AgentCore**, combining IoT telemetry validation, parametric insurance triggers, cognitive salvage synthesis, and cryptographic evidence sealing.

```
┌─────────────────────────────────────────────────────────────┐
│               MISSION CONTROL DASHBOARD (Web UI)            │
│   Telemetry Chart │ Salvage Options │ HITL Gate │ Audits    │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (FastAPI)
┌──────────────────────────┴──────────────────────────────────┐
│              AWS STRANDS AGENT HARNESS                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 11 Tools │ │ Hooks    │ │ Steering │ │ Skills   │       │
│  │ (typed)  │ │ (safety) │ │ (gates)  │ │ (domain) │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└──────────────────────────┬──────────────────────────────────┘
                           │
    ┌──────────┬───────────┼───────────┬──────────┐
    ▼          ▼           ▼           ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Teleme- │ │Policy  │ │Evidence│ │Workflow│ │Settle- │
│try     │ │Engine  │ │Hasher  │ │Approval│ │ment    │
│Validator│ │+Trigger│ │+Merkle │ │+Audit  │ │Calc    │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

---

## 🔧 Deep Dive into the AWS Strands Agents SDK

Following the principles demonstrated in the AWS Devpost build session, we structured PerishLock around four core Strands primitives:

### 1. The Reasoning Loop & 11 Typed Tools (`@tool`)
Rather than relying on ungrounded text generation, our Strands agent executes its cognitive workflow through 11 strictly typed tools:
- `load_incident_scope`: Ingests the policy terms, insured lot, and coverage limits.
- `get_sensor_evidence`: Retrieves validated dual-sensor telemetry consensus.
- `get_trigger_evaluation`: Runs deterministic parametric threshold checking (>13°C for ≥240 min).
- `get_weather_context`: Ingests ambient regional conditions and grid reliability data.
- `find_eligible_partners` & `calculate_route_matrix`: Evaluates regional processors, cold hubs, and food banks, calculating transit times and reefer freight costs.
- `prepare_response_options`: The cognitive core. Reconciles messy, semi-structured partner intake notes (e.g. *"Shift B intake dock closes at 18:00 for maintenance"*) into mathematically optimized multi-destination salvage strategies.
- `seal_incident_packet`: Hashes all telemetry, trigger data, and quotes into a SHA-256 Merkle root.
- `draft_claim_notice`: Computes parametric yield-gap indemnification to close farmer financial losses.
- `request_coordinator_approval`: Generates a single-use cryptographic approval token and halts execution.
- `publish_sandbox_contact`: Post-approval carrier and partner dispatch.

### 2. Deterministic Lifecycle Hooks (`HookProvider`)
Agents in production must be governed by deterministic guardrails:
- **`RateLimiterHook`**: Intercepts `BeforeToolCallEvent` to track tool call counts per turn. If an agent enters an infinite loop, it halts execution at 25 calls.
- **`ColdRoomSafetyHook`**: Strictly intercepts any invocation of `publish_sandbox_contact`. If a valid, non-mock `approval_id` is missing, the tool call is cancelled immediately.

### 3. Dynamic Knowledge with `AgentSkills`
A common antipattern is overloading the agent's system prompt with encyclopedic domain knowledge. We created an on-demand skill:
- **`skills/fresh-tomatoes/SKILL.md`**: Contains temperature-dependent decay kinetics ($Q_{10}$ temperature coefficients), chill injury boundaries (<10°C), ripening rates, and sorting standards. 
- Loaded dynamically via `AgentSkills(skills=[SKILLS_DIR])` only when a tomato breach is confirmed.

### 4. Real-Time Steering Handlers (`SteeringHandler`)
Our favorite feature of the Strands SDK is steering:
- **`DispatchApprovalSteeringHandler`**: Uses `LedgerProvider` to inspect the chronological history of tool calls. If the agent attempts to finalize dispatch before preparing response options and requesting coordinator approval, the handler returns `Guide(...)` instructing the agent to complete the approval workflow first.
- **`ToneGuardrailHandler`**: Steers post-model outputs to maintain cooperative empathy and prevent attributing blame to stressed cooperative farmers.

---

## ☁️ Scaling with Amazon Bedrock AgentCore

To bring PerishLock from a prototype into production, we utilized **Amazon Bedrock AgentCore**:

1. **Bedrock AgentCore Memory**:
   Cross-session persistence is critical for cooperatives. When incidents occur weeks apart, AgentCore Memory retains historical partner reliability scores, dock operating quirks, and prior settlement precedents.
2. **Bedrock AgentCore Gateway**:
   Provides managed VPC isolation, rate limiting (600 RPM ingress), and private endpoints for remote IoT sensors streaming from rural micro-gateways.
3. **Model Agility**:
   PerishLock seamlessly switches between **Amazon Nova Pro** (`amazon.nova-pro-v1:0`) and **Anthropic Claude 3.5 Sonnet** on Bedrock without touching any application code.

---

## 🔒 Cryptographic Defense & Human-in-the-Loop Safety

Two critical innovations distinguish PerishLock from standard agent prototypes:

1. **SHA-256 Merkle Evidence Manifest**:
   Every incident artifact—telemetry series, validator logs, partner quotes, and agent traces—is serialized to canonical JSON and hashed into a 4-component Merkle tree. Any post-incident tampering with temperature data immediately invalidates the root hash.
2. **Anti-Replay Cryptographic Token Gate**:
   When the agent generates salvage strategies, it pauses. It issues a high-entropy, single-use HMAC token expiring in 60 minutes. The human coordinator must review the trade-offs on Mission Control and click **"Authorize Dispatch"**. Once consumed, the token is permanently invalidated, preventing replay attacks.

---

## 📊 Real-World Impact: By the Numbers

In our canonical evaluation scenario:
- **Cargo Protected**: 14,200 kg Fresh Roma Tomatoes
- **Option A (Financial Maximum)**:
  - Diverts 9,500 kg to regional cannery at $0.42/kg + 4,700 kg to local farm stands.
  - Generates $5,820.00 gross salvage salvage.
  - Parametric yield-gap payout triggers: **$3,622.50**.
  - **Net Farmer Recovery: $8,768.50 (95.0% of full contract value!)**
- **Option B (Rapid Community Relief)**:
  - Diverts 4,500 kg to Hope Food Rescue, feeding **1,800 local families** while recovering 74% value through tax credits and rapid processor delivery.
- **Decision Latency**: Reduced from **3 weeks to under 30 seconds**.

---

## 🏁 Conclusion

Building with the AWS Strands Agents SDK proved that autonomous agents do not have to be black-box chatbots. With deterministic hooks, trajectory steering, and Bedrock AgentCore infrastructure, we can build agents that operate with mathematical rigor, cryptographic integrity, and deep respect for human oversight.

When cold chains break, farmers shouldn't have to break too.

*Check out the code, run the zero-credential demo, and explore the architecture on our GitHub repo.*
