#!/usr/bin/env python3
"""Batch-download Instagram posts from instagram_scrape.json."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRAPE = ROOT / "assets" / "social" / "metadata" / "instagram_scrape.json"
OUT = ROOT / "assets" / "social" / "instagram" / "posts"
YTDLP = ROOT / ".tools" / "venv" / "bin" / "yt-dlp"
GDL = ROOT / ".tools" / "venv" / "bin" / "gallery-dl"


def has_assets(post_id: str) -> bool:
    return any(OUT.glob(f"{post_id}*"))


def main() -> None:
    links = json.loads(SCRAPE.read_text(encoding="utf-8"))["links"]
    ok = fail = skip = 0
    for url in links:
        post_id = url.rstrip("/").split("/")[-1]
        if has_assets(post_id):
            skip += 1
            continue
        print(f">>> {url}")
        r = subprocess.run(
            [
                str(YTDLP),
                "--cookies-from-browser",
                "chrome",
                "--write-info-json",
                "--write-description",
                "--write-thumbnail",
                "--ignore-errors",
                "-o",
                "assets/social/instagram/posts/%(id)s.%(ext)s",
                url,
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        if r.returncode == 0:
            ok += 1
            continue
        r2 = subprocess.run(
            [str(GDL), "--cookies-from-browser", "chrome", "-d", "assets/social/instagram/posts", url],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        if r2.returncode == 0:
            ok += 1
        else:
            fail += 1
            err = (r.stderr or r.stdout or r2.stderr or "")[-300:]
            print(f"    FAIL: {err}")
    print(f"skip={skip} ok={ok} fail={fail}")


if __name__ == "__main__":
    main()
