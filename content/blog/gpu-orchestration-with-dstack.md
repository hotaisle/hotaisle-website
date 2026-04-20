# Orchestrating AMD GPUs with dstack

Slug: gpu-orchestration-with-dstack
Publish: Yes
Meta Title: Orchestrating AMD GPUs with dstack
Meta Description: A technical guide to orchestrating AMD GPUs on Hot Aisle with `dstack`, including backend and fleet configuration, dev environments, inference services, and training tasks.
Author: Andrey Cheptsov
Date: 03/02/2026
Description: Step-by-step guide to configuring `dstack` with Hot Aisle for AMD MI300X provisioning, development, inference, and training workflows.
Featured: No
HA Footer: true
Tags: GPU, Orchestration, dstack, AMD, MI300X, Guest

# Orchestrating AMD GPUs with dstack

This guide shows how to use `dstack` on Hot Aisle for orchestrating AMD GPU workloads, using AMD MI300X examples throughout. It focuses on automation: provisioning infrastructure, running containers, and managing development, inference, and training runs with versioned YAML.

You will set up a Hot Aisle backend, create fleets for on-demand and reserved capacity, and run `dev-environment`, `service`, and `task` configurations using one CLI workflow.

## **Why GPU orchestration?**

Without orchestration, teams usually provision VMs manually, run containers with ad-hoc commands, and keep critical run parameters in shell history. That increases setup time, makes cost control harder, and creates drift across users and environments.

[`dstack`](https://github.com/dstackai/dstack) addresses this by making both infrastructure and workloads declarative. You define provisioning policies in fleets, describe workloads as run configurations, and apply them through one workflow. This is especially useful for GPU workloads where automatic provisioning, management of idle instances, and predictable container startup directly improve cost control and iteration speed.

## Setup

### On-demand VMs

Install the CLI first:

```bash
uv tool install "dstack[all]"
```

Then configure the Hot Aisle backend in `~/.dstack/server/config.yml`:

```yaml
projects:
  - name: main
    backends:
      - type: hotaisle
        team_handle: ${HOTAISLE_TEAM_HANDLE}
        creds:
          type: api_key
          api_key: ${HOTAISLE_API_KEY}
```

After updating server config, start or restart `dstack server` so backend changes are picked up.

Now check available MI300X offers:

```bash
dstack offer --gpu MI300X
```

Typical output (truncated):

```text
 #  BACKEND   REGION        INSTANCE          RESOURCES                              SPOT  PRICE
 1  hotaisle  us-east-1     <mi300x-offer-1>  32xCPU, 256GB, 1xAMD MI300X (192GB)   no    $X.XX
 2  hotaisle  us-east-1     <mi300x-offer-2>  64xCPU, 512GB, 2xAMD MI300X (192GB)   no    $Y.YY
 ...
```

Create a [backend fleet](https://dstack.ai/concepts/fleets/#backend-fleet) with a node range:

```yaml
type: fleet
name: mi300x-on-demand

# Keep at most 4 VMs; provision on demand
nodes: 0..4
idle_duration: 30m

resources:
  # from 1 to 8 MI300X GPUs per VM
  gpu: MI300X:1..8
```

Apply it:

```bash
dstack apply -f fleet.dstack.yml
```

With `nodes: 0..4`, `dstack` creates a fleet template and provisions new VMs only when runs require capacity. When instances stay idle longer than `idle_duration`, they are terminated automatically.

### Reserved clusters

If you reserve a cluster from Hot Aisle with fast interconnect, use an [SSH fleet](https://dstack.ai/concepts/fleets/#ssh-fleet). This is useful for distributed training, large-model inference that exceeds one node, or prefill/decode disaggregation.

```yaml
type: fleet
name: mi300x-reserved
nodes: 2
placement: cluster

ssh_config:
  user: ubuntu
  identity_file: ~/.ssh/id_ed25519
  hosts:
    - 203.0.113.11
    - 203.0.113.12
```

Apply:

```bash
dstack apply -f fleet-mi300x-reserved.dstack.yml
```

For AMD hosts, ensure AMDGPU-DKMS and ROCm userspace components are installed before attaching hosts to `dstack`.

### IDEs & notebooks

For AMD runs, use a custom Docker image. The default `dstack` image is CUDA-oriented, so AMD workflows should specify an image explicitly.

Use a [`dev-environment`](https://dstack.ai/concepts/dev-environments/) to launch a remote IDE session on MI300X:

```yaml
type: dev-environment
name: mi300x-dev

image: rocm/dev-ubuntu-24.04:latest
ide: cursor

resources:
  gpu: MI300X:1
```

Launch:

```bash
dstack apply -f dev.dstack.yml
```

`dstack apply` attaches automatically. Typical output includes an IDE link:

```text
Launching `mi300x-dev`...
---> 100%

To open in Cursor Desktop, use this link:
  cursor://vscode-remote/ssh-remote+mi300x-dev/workspace
```

### Model inference

Use a [`service`](https://dstack.ai/concepts/services/) run when you need a stable model endpoint. The example below follows the same MI300X + ROCm pattern used in [opencode-vllm-hotaisle.md](opencode-vllm-hotaisle.md).

```yaml
type: service
name: qwen3-coder-mi300x

image: rocm/vllm:latest
env:
  - HF_TOKEN
commands:
  - |
    vllm serve Qwen/Qwen3-Coder-30B-A3B-Instruct \
      --port 8000 \
      --block-size 256 \
      --max-model-len 131272 \
      --enable-auto-tool-choice \
      --tool-call-parser qwen3_xml
port: 8000
model: Qwen/Qwen3-Coder-30B-A3B-Instruct

resources:
  gpu: MI300X:1
```

Apply:

```bash
HF_TOKEN=... dstack apply -f qwen.dstack.yml
```

`dstack` tracks service health and keeps replicas in the desired state. To inspect status:

```bash
dstack ps -v
```

If service `auth` is enabled (default), call the model endpoint with a `dstack` token:

```bash
curl -sS -X POST "http://localhost:3000/proxy/services/main/qwen3-coder-mi300x/v1/chat/completions" \
  -H "Authorization: Bearer ${DSTACK_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen3-Coder-30B-A3B-Instruct",
    "messages": [{"role": "user", "content": "Write a one-line health check."}],
    "max_tokens": 64
  }'
```

For a more advanced way to expose endpoints (custom domain, HTTPS, and routing policies), configure a `dstack` [gateway](https://dstack.ai/concepts/gateways/) and publish the service through it. In that setup, the model endpoint is typically `https://<service-name>.<gateway-domain>/v1` (for this example: `https://qwen3-coder-mi300x.<gateway-domain>/v1`).

### Training & web-apps

Use [`task`](https://dstack.ai/concepts/tasks/) runs for finite training jobs and internal web apps. For distributed training, run tasks on a fleet configured with `placement: cluster` and set `nodes` in the task.

A single-node MI300X training task:

```yaml
type: task
name: mi300x-sft

image: rocm/pytorch:rocm7.2_ubuntu24.04_py3.12_pytorch_release_2.7.1
env:
  - HF_TOKEN
commands:
  - python -m pip install -U transformers datasets accelerate trl peft
  - python train_sft.py --model Qwen/Qwen2.5-7B-Instruct --epochs 3

resources:
  gpu: MI300X:1
```

For failed runs:

```bash
dstack ps -v
dstack logs -d mi300x-sft
```

Tasks can expose ports; while attached, `dstack` forwards remote ports to localhost.

```yaml
type: task
name: openclaw-mi300x

python: "3.12"
env:
  - OPENCLAW_TOKEN
  - MODEL_BASE_URL
  - DSTACK_MODEL_TOKEN
commands:
  - curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
  - openclaw config set gateway.mode local
  - openclaw config set gateway.auth.mode token
  - openclaw config set gateway.auth.token "$OPENCLAW_TOKEN"
  - openclaw config set gateway.trustedProxies '["127.0.0.1"]'
  - |
    openclaw config set models.providers.mi300x '{
      "baseUrl":"'"$MODEL_BASE_URL"'",
      "apiKey":"'"$DSTACK_MODEL_TOKEN"'",
      "api":"openai-completions",
      "models":[
        {
          "id":"Qwen/Qwen3-Coder-30B-A3B-Instruct",
          "name":"Qwen3-Coder-30B-A3B-Instruct",
          "reasoning":true,
          "input":["text"],
          "cost":{"input":0,"output":0,"cacheRead":0,"cacheWrite":0},
          "contextWindow":131072,
          "maxTokens":8192
        }
      ]
    }' --json
  - openclaw gateway
ports:
  - 18789
```

The OpenClaw task above starts a local gateway on `localhost:18789` and points it to your model service endpoint.

Use these variables when applying:
- `MODEL_BASE_URL`: gateway service `/v1` endpoint (for example, `https://qwen3-coder-mi300x.<gateway-domain>/v1`)
- `DSTACK_MODEL_TOKEN`: your `dstack` user token used by built-in service authentication

```bash
dstack apply \
  -e OPENCLAW_TOKEN=... \
  -e MODEL_BASE_URL=https://qwen3-coder-mi300x.<gateway-domain>/v1 \
  -e DSTACK_MODEL_TOKEN=... \
  -f task-openclaw.dstack.yml
```

## Summary

`dstack` automates GPU provisioning and workload orchestration, and it simplifies container-based execution for day-to-day development, inference, and training.

Two operational behaviors matter most in day-to-day use:

1. Fleet idle control: with `idle_duration`, `dstack` can automatically terminate idle VMs, which helps avoid wasting GPU resources.
2. Team operation: projects, fleets, and runs are shared across members, so one team can use a consistent control plane and auth model.

Core commands to keep in regular use: `dstack apply`, `dstack fleet`, `dstack ps`, `dstack logs`, and `dstack stop`.

Useful references:

- `dstack` repository: https://github.com/dstackai/dstack
- `dstack` docs: https://dstack.ai
- `dstack` skill (for agent-assisted YAML/CLI workflows): https://skills.sh/dstackai/dstack/dstack
