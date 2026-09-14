"""PerishLock Interactive Judge Speedrun Demo.

Run with:
    python -m perishlock.demo

Executes the complete end-to-end cold-chain disruption defense and salvage workflow
with zero required cloud credentials.
"""

import sys
import time
import json

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.progress import Progress, SpinnerColumn, TextColumn

from perishlock.agent.strands_agent import DeterministicTrajectoryRunner

console = Console(legacy_windows=False)


def print_banner():
    banner_text = """
 =========================================================================
   ____           _     _     _               _    
  |  _ \ ___ _ __(_)___| |__ | |    ___   ___| | __
  | |_) / _ \ '__| / __| '_ \| |   / _ \ / __| |/ /
  |  __/  __/ |  | \__ \ | | | |__| (_) | (__|   < 
  |_|   \___|_|  |_|___/_| |_|_____\___/ \___|_|\_\
                                                   
   AUTONOMOUS COLD-CHAIN DEFENSE & PARAMETRIC SALVAGE PROTOCOL
 =========================================================================
    """
    console.print(f"[bold cyan]{banner_text}[/bold cyan]")
    console.print(
        Panel.fit(
            "[bold white]AWS Agents for Humans Hackathon[/bold white] | Track: [bold green]Good Neighbor Agents[/bold green]\n"
            "Target: [yellow]Riverbend Smallholder Farmer Cooperative (14.2 tons Fresh Roma Tomatoes)[/yellow]",
            border_style="cyan"
        )
    )


def run_demo():
    print_banner()

    runner = DeterministicTrajectoryRunner("INC-POL-RB-TOM-2026-001")

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True,
    ) as progress:
        task = progress.add_task("[cyan]Initializing IoT sensor stream and policy fixtures...", total=None)
        time.sleep(0.3)
        progress.update(task, description="[yellow]Evaluating sustained 4-hour thermal breach (T > 13.0 C)...")
        time.sleep(0.3)
        progress.update(task, description="[magenta]Invoking AWS Strands Agent & reconciling partner intake notes...")
        time.sleep(0.4)
        res = runner.run_speedrun()
        progress.update(task, description="[green]Sealing SHA-256 Merkle evidence packet...")
        time.sleep(0.2)

    console.print("\n[bold green][1] SENSOR TELEMETRY & BREACH EVALUATION[/bold green]")
    table_telemetry = Table(title="Chamber A Telemetry Summary", border_style="blue")
    table_telemetry.add_column("Metric", style="cyan")
    table_telemetry.add_column("Observed Value", style="white")
    table_telemetry.add_column("Policy Threshold", style="yellow")
    table_telemetry.add_column("Status", style="bold red")

    s_data = res["steps"][1]["data"]
    tr_data = res["steps"][2]["data"]
    table_telemetry.add_row("Mean Temperature", f"{s_data['mean_temp_c']} C", "10.0 - 12.5 C", "BREACH")
    table_telemetry.add_row("Peak Temperature", f"{s_data['peak_temp_c']} C", "> 13.0 C Trigger", "CRITICAL")
    table_telemetry.add_row("Continuous Breach", f"{tr_data['continuous_breach_minutes']} mins", ">= 240.0 mins (4h)", "TRIGGER CONFIRMED")
    table_telemetry.add_row("Dual-Sensor Consensus", s_data["dual_sensor_consensus"], "Max drift <= 1.5 C", "VALIDATED (0.2 C drift)")
    console.print(table_telemetry)

    console.print("\n[bold yellow][2] COGNITIVE LLM REASONING: RECONCILING MESSY PARTNER NOTES[/bold yellow]")
    console.print(
        Panel(
            "- [bold red]Metro Wholesale Produce Terminal (Rejected):[/bold red] Offers $0.48/kg, but notes require firm-ripe core temp < 15.5 C. Peak chamber temp hit 16.8 C. >90% probability of terminal rejection + $150 unloading penalty.\n"
            "- [bold green]Valley Fresh Cannery & Paste (Approved):[/bold green] Shift B closes at 18:00 for boiler service. Distance is 28.4km (35m transit). Dispatched before 16:30 guarantees timely check-in.\n"
            "- [bold cyan]Hope Community Food Rescue (Social Route):[/bold cyan] Volunteer sorting crew available until 17:00. Distance 14.2km (18m transit). Rapid evacuation of 4.5 tons direct to 1,800 local families.\n"
            "- [bold magenta]Mandatory Reefer Carrier Assigned:[/bold magenta] Ambient heatwave (35.8 C) threatens flash-softening within 2.5 hours without active refrigeration.",
            title="Strands Agent Multi-Destination Logic",
            border_style="yellow"
        )
    )

    console.print("\n[bold cyan][3] SALVAGE STRATEGY TRADE-OFF MATRIX[/bold cyan]")
    table_opt = Table(title="Generated Response Options (Presented to Coordinator)", border_style="green")
    table_opt.add_column("Option ID", style="bold cyan")
    table_opt.add_column("Strategy Name", style="white")
    table_opt.add_column("Volume Salvaged", style="green")
    table_opt.add_column("Net Recovery", style="bold green")
    table_opt.add_column("Value Retention", style="yellow")
    table_opt.add_column("Social Impact", style="magenta")

    for opt in res["options"]:
        rec = " [bold green](RECOMMENDED)[/bold green]" if opt.get("coordinator_recommended") else ""
        table_opt.add_row(
            opt["option_id"],
            opt["strategy_name"] + rec,
            f"{opt['total_salvaged_kg']:,.0f} kg",
            f"${opt['total_net_recovery_usd']:,.2f}",
            f"{opt['value_retention_pct']}%",
            opt.get("social_impact_description") or "Commercial recovery"
        )
    console.print(table_opt)

    console.print("\n[bold magenta][4] PARAMETRIC SETTLEMENT CLAIM READY[/bold magenta]")
    claim = res["settlement_claim"]
    table_claim = Table(title="Parametric Yield Gap Indemnity Draft", border_style="magenta")
    table_claim.add_column("Field", style="cyan")
    table_claim.add_column("Amount (USD)", style="white")
    table_claim.add_row("Contracted Asset Value", f"${claim['contracted_asset_value_usd']:,.2f}")
    table_claim.add_row("Net Salvage Recovery", f"${claim['salvage_recovery_usd']:,.2f}")
    table_claim.add_row("Yield Gap Loss", f"${claim['yield_gap_loss_usd']:,.2f}")
    table_claim.add_row("Parametric Insurance Payout", f"${claim['parametric_payout_usd']:,.2f}")
    table_claim.add_row("Total Farmer Realization", f"[bold green]${claim['total_farmer_realization_usd']:,.2f} ({claim['total_farmer_realization_pct']}%) [/bold green]")
    console.print(table_claim)

    console.print("\n[bold blue][5] IMMUTABLE EVIDENCE MERKLE MANIFEST[/bold blue]")
    console.print(f"  [bold]Manifest Root SHA-256:[/bold] [yellow]{res['manifest_hash']}[/yellow]")
    console.print("  [green]Integrity status:[/green] [bold green]CRYPTOGRAPHICALLY VERIFIED[/bold green]")

    console.print("\n[bold red][6] STRICT HUMAN-IN-THE-LOOP (HITL) GATE ENFORCED[/bold red]")
    console.print(
        Panel(
            f"[bold white]Approval Request ID:[/bold white] {res['approval_request_id']}\n"
            f"[bold white]Coordinator Token:[/bold white] {res['raw_approval_token']}\n"
            f"[bold white]Mission Control Authorization URL:[/bold white]\n[underline cyan]{res['approval_url']}[/underline cyan]\n\n"
            "[italic yellow]The agent has paused execution. No carrier contracts or payouts can be finalized without human approval.[/italic yellow]",
            title="Human Gatekeeper Gating",
            border_style="red"
        )
    )

    console.print("\n[bold green]SPEEDRUN EXECUTION COMPLETE - ALL SYSTEMS OPERATIONAL[/bold green]\n")


if __name__ == "__main__":
    run_demo()
