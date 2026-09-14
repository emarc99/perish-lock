# 🚀 Amazon Bedrock AgentCore Deployment Guide

This directory contains the deployment automation to provision PerishLock onto **Amazon Bedrock AgentCore** and AWS infrastructure.

---

## 🏗️ Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Amazon Bedrock Runtime  │
                          │   (Amazon Nova Pro /      │
                          │    Claude 3.5 Sonnet)     │
                          └─────────────▲─────────────┘
                                        │ Inference
┌─────────────────────────┐   ┌─────────┴─────────────┐   ┌─────────────────────────┐
│   AgentCore Gateway     │──►│   Bedrock AgentCore   │◄──│    AgentCore Memory     │
│   (VPC / Rate Limiting) │   │   PerishLock Runtime  │   │ (Cross-session incident)│
└─────────────────────────┘   └─────────┬─────────────┘   └─────────────────────────┘
                                        │
             ┌──────────────────────────┼──────────────────────────┐
             ▼                          ▼                          ▼
┌─────────────────────────┐┌─────────────────────────┐┌─────────────────────────┐
│  S3 Evidence Vault      ││  Human-in-the-Loop Gate ││  Cooperative Partners   │
│  (Object Lock / Merkle) ││  (Single-use HMAC token)││  (Sandboxed Dispatch)   │
└─────────────────────────┘└─────────────────────────┘└─────────────────────────┘
```

---

## 🛠️ Deployment Steps

### Option A: Using Your AWS Account ($50 Hackathon Credits)

1. **Configure your AWS credentials**:
   ```bash
   aws configure
   # Enter your AWS Access Key, Secret Key, and default region (us-east-1)
   ```

2. **Deploy CloudFormation Stack**:
   ```bash
   aws cloudformation deploy \
     --template-file deploy/cloudformation_agentcore.yaml \
     --stack-name perishlock-prod \
     --capabilities CAPABILITY_NAMED_IAM \
     --parameter-overrides EnvironmentName=prod BedrockModelId=amazon.nova-pro-v1:0
   ```

3. **Provision Bedrock AgentCore Runtime, Memory, and Gateway**:
   ```bash
   python -m deploy.agentcore --region us-east-1
   ```

4. **Run or Deploy Mission Control**:
   - **Locally connecting to Bedrock**:
     ```bash
     export AWS_DEFAULT_REGION=us-east-1
     python -m perishlock.api.server
     ```
   - **Containerized on AWS App Runner / ECS**:
     ```bash
     docker build -t perishlock -f deploy/Dockerfile .
     ```

---

### Option B: Standalone Offline Simulation / Evaluation Mode

If evaluating without active AWS credentials, the system automatically falls back to deterministic zero-credential execution:

```bash
# Verify AgentCore provisioning pipeline (dry run)
python -m deploy.agentcore --dry-run

# Run standalone offline simulation
python -m perishlock.demo

# Launch local Mission Control
python -m perishlock.api.server
```
