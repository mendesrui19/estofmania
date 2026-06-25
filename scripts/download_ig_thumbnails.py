#!/usr/bin/env python3
"""Download Instagram grid thumbnails from browser scrape."""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRAPE = ROOT / "assets" / "social" / "metadata" / "instagram_scrape.json"
OUT = ROOT / "assets" / "social" / "instagram" / "thumbnails"


def image_key(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    name = Path(parsed.path).name
    return re.sub(r"\.(jpg|jpeg|webp).*$", "", name, flags=re.I) or hashlib.md5(url.encode()).hexdigest()[:12]


def main() -> None:
    data = json.loads(SCRAPE.read_text(encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)
    seen: set[str] = set()
    saved = 0
    for item in data.get("imgs", []):
        src = item.get("src", "")
        if not src or "cdninstagram" not in src:
            continue
        key = image_key(src)
        if key in seen:
            continue
        seen.add(key)
        alt = re.sub(r"[^\w\-]+", "_", item.get("alt", "")[:60]).strip("_") or "post"
        dest = OUT / f"{key}_{alt[:40]}.jpg"
        if dest.exists():
            saved += 1
            continue
        try:
            subprocess.run(
                ["curl", "-fsSL", "-A", "Mozilla/5.0", "-o", str(dest), src],
                check=True,
                timeout=60,
            )
            saved += 1
        except (subprocess.CalledProcessError, subprocess.TimeoutExpired):
            pass
    meta = OUT / "index.json"
    meta.write_text(
        json.dumps({"count": saved, "items": data.get("imgs", [])[:50]}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Thumbnails saved: {saved} -> {OUT}")


if __name__ == "__main__":
    main()
