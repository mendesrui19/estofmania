#!/usr/bin/env python3
"""Curate sharp, high-resolution images for the premium Estofmania site."""
from __future__ import annotations

import hashlib
import json
import shutil
from collections import Counter
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SOCIAL = ROOT / "assets" / "social"
OUT = ROOT / "assets" / "premium"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".image"}

MIN_WIDTH = 1080
MIN_LONG_EDGE = 1080
MIN_KB = 120
MIN_SHARPNESS = 55.0
MAX_PER_CATEGORY = 6


def sharpness(path: Path) -> float:
    with Image.open(path) as im:
        gray = im.convert("L")
        gray.thumbnail((1200, 1200))
        edges = gray.filter(ImageFilter.FIND_EDGES)
        return ImageStat.Stat(edges).var[0]


def content_hint(name: str) -> str:
    n = name.lower()
    if any(x in n for x in ("antes", "depois", "before", "transform", "nova_vida")):
        return "antes-depois"
    if "tapete" in n or "carpet" in n:
        return "tapetes"
    if "colch" in n or "mattress" in n:
        return "colchoes"
    if "cortin" in n or "curtain" in n:
        return "cortinas"
    if any(x in n for x in ("sof", "sofa", "estof", "mancha")):
        return "estofos"
    if "perfil" in n or "profile" in n:
        return "brand"
    return "geral"


def tier_for(rel: str) -> int:
    if "/posts/instagram/" in rel:
        return 0
    if "/posts/" in rel:
        return 1
    if "/thumbnails/" in rel:
        return 2
    return 3


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*"):
        if old.is_file():
            old.unlink()

    candidates: list[dict] = []
    for path in SOCIAL.rglob("*"):
        if path.suffix.lower() not in EXTS:
            continue

        rel = str(path.relative_to(SOCIAL))
        if "/thumbnails/" in rel or "/tiktok/" in rel:
            continue
        if "profile" in rel.lower() or "foto_de_perfil" in path.name.lower():
            continue

        try:
            with Image.open(path) as im:
                w, h = im.size
        except OSError:
            continue

        if max(w, h) < MIN_LONG_EDGE or w < MIN_WIDTH:
            continue
        kb = path.stat().st_size // 1024
        if kb < MIN_KB:
            continue

        try:
            sh = sharpness(path)
        except OSError:
            continue
        if sh < MIN_SHARPNESS:
            continue

        digest = hashlib.md5(path.read_bytes()).hexdigest()
        candidates.append(
            {
                "path": path,
                "rel": rel,
                "w": w,
                "h": h,
                "kb": kb,
                "sharp": round(sh, 1),
                "tier": tier_for(rel),
                "digest": digest,
                "hint": content_hint(path.name + " " + rel),
            }
        )

    seen: set[str] = set()
    unique: list[dict] = []
    for item in sorted(candidates, key=lambda x: (x["tier"], -x["sharp"], -(x["w"] * x["h"]))):
        if item["digest"] in seen:
            continue
        seen.add(item["digest"])
        unique.append(item)

    by_cat: dict[str, int] = {}
    final: list[dict] = []
    for item in unique:
        cat = item["hint"]
        if by_cat.get(cat, 0) >= MAX_PER_CATEGORY:
            continue
        by_cat[cat] = by_cat.get(cat, 0) + 1
        final.append(item)

    manifest: list[dict] = []
    for i, item in enumerate(sorted(final, key=lambda x: (x["hint"], -x["sharp"])), 1):
        ext = ".jpg" if item["path"].suffix.lower() in {".image", ".jpeg"} else item["path"].suffix.lower()
        name = f"{i:02d}_{item['hint']}{ext}"
        dest = OUT / name
        shutil.copy2(item["path"], dest)
        manifest.append(
            {
                "file": f"assets/premium/{name}",
                "category": item["hint"],
                "width": item["w"],
                "height": item["h"],
                "sharpness": item["sharp"],
                "source": item["rel"],
                "recommended_use": "hero" if item["sharp"] > 120 and item["w"] >= 1400 else "gallery",
            }
        )

    (OUT / "manifest.json").write_text(
        json.dumps({"count": len(manifest), "criteria": {
            "min_width": MIN_WIDTH,
            "min_long_edge": MIN_LONG_EDGE,
            "min_kb": MIN_KB,
            "min_sharpness": MIN_SHARPNESS,
        }, "images": manifest}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"CURATED {len(manifest)} images -> {OUT}")
    print("categories", dict(Counter(m["category"] for m in manifest)))
    for entry in manifest:
        print(
            f"  {entry['file']} {entry['width']}x{entry['height']} "
            f"sharp={entry['sharpness']} use={entry['recommended_use']}"
        )


if __name__ == "__main__":
    main()
