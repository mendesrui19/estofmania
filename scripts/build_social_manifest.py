#!/usr/bin/env python3
"""Compile social scrape metadata into assets/social/metadata/manifest.json"""
from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOCIAL = ROOT / "assets" / "social"
OUT = SOCIAL / "metadata" / "manifest.json"

PROFILE = {
    "name": "Estofmania",
    "username": "estofmania",
    "tagline": "Limpeza e Higienização Profissional",
    "bio": (
        "Especialistas em limpeza e impermeabilização de estofos / Tapetes e Cortinados. "
        "Famalicão e Arredores. Envie mensagem e peça orçamento grátis."
    ),
    "services": [
        "Limpeza e higienização",
        "Impermeabilização",
        "Sofás e cadeiras",
        "Colchões",
        "Tapetes",
        "Cortinas",
    ],
    "locations": ["Famalicão", "Lousado", "Trofa", "arredores"],
    "instagram": "https://www.instagram.com/estofmania/",
    "tiktok": "https://www.tiktok.com/@estofmania",
    "linktree": "https://linktr.ee/estofmania.pt",
    "instagram_stats": {"followers": 5188, "following": 2087, "posts": 156},
    "tiktok_stats": {"followers": 26, "following": 40, "likes": 67},
    "highlights": ["Serviços", "Impermeabilização", "antes&depois", "Feedback"],
    "hashtags": ["#limpeza", "#famalicao", "#trofa", "#limpezadetapetes", "#organização"],
}


def load_json(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def collect_platform(platform: str) -> list[dict]:
    folder = SOCIAL / platform
    if not folder.exists():
        return []

    items: dict[str, dict] = {}
    for info_path in sorted(folder.rglob("*.info.json")):
        data = load_json(info_path)
        if not data:
            continue
        vid = data.get("id") or info_path.stem
        if vid.startswith("NA_"):
            continue

        desc_path = info_path.with_suffix("").with_suffix(".description")
        description = desc_path.read_text(encoding="utf-8").strip() if desc_path.exists() else data.get("description", "")

        media = []
        for ext in (".mp4", ".jpg", ".jpeg", ".png", ".webp", ".image"):
            for p in info_path.parent.glob(f"{info_path.stem.replace('.info', '')}*{ext}"):
                if p.suffix == ".json":
                    continue
                media.append(str(p.relative_to(ROOT)))

        stem = re.sub(r"\.info$", "", info_path.stem)
        base = info_path.parent / stem
        for p in info_path.parent.glob(f"{base.name}*"):
            if p.suffix in {".mp4", ".jpg", ".jpeg", ".png", ".webp", ".image"} and str(p.relative_to(ROOT)) not in media:
                media.append(str(p.relative_to(ROOT)))

        items[vid] = {
            "id": vid,
            "platform": platform,
            "title": data.get("title") or data.get("description", "")[:120],
            "description": description,
            "url": data.get("webpage_url") or data.get("url"),
            "upload_date": data.get("upload_date"),
            "view_count": data.get("view_count"),
            "like_count": data.get("like_count"),
            "media_files": sorted(set(media)),
            "info_file": str(info_path.relative_to(ROOT)),
        }

    return list(items.values())


def main() -> None:
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "profile": PROFILE,
        "tiktok": collect_platform("tiktok"),
        "instagram_posts": collect_platform("instagram/posts"),
        "notes": {
            "instagram_full_profile": (
                "Perfil tem 156 publicações; extraímos amostra visível + reels. "
                "Para download completo sem login, exportar dados Meta ou fornecer cookies."
            ),
            "image_only_posts": (
                "Alguns posts só-imagem falharam no yt-dlp; thumbnails da grelha em instagram/thumbnails/."
            ),
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"TikTok items: {len(manifest['tiktok'])}")
    print(f"Instagram items: {len(manifest['instagram_posts'])}")


if __name__ == "__main__":
    main()
