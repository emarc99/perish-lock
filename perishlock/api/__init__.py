"""PerishLock API Package."""

__all__ = ["app"]


def __getattr__(name):
    if name == "app":
        from perishlock.api.server import app
        return app
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
