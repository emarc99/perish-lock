"""FastAPI server entrypoint for PerishLock Mission Control."""

from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from perishlock.api.routes import router

app = FastAPI(
    title="PerishLock Mission Control API",
    description="Autonomous Cold-Chain Disruption Defense & Parametric Salvage Protocol",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

ASSETS_DIR = Path(__file__).parent.parent.parent / "assets"
if ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

WEB_DIR = Path(__file__).parent.parent.parent / "web"
if WEB_DIR.exists():
    app.mount("/", StaticFiles(directory=str(WEB_DIR), html=True), name="static")


def start():
    """Run server via uvicorn."""
    import uvicorn
    uvicorn.run("perishlock.api.server:app", host="0.0.0.0", port=8000, reload=False)


if __name__ == "__main__":
    start()
