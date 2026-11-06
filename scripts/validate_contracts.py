#!/usr/bin/env python3
"""Valide les contrats d'apparence (stdlib uniquement, aucun réseau).

Usage : python3 scripts/validate_contracts.py
Code de sortie 0 = OK, 1 = erreurs.
"""
from pathlib import Path
import json
import re
import struct
import sys

ROOT = Path(__file__).resolve().parent.parent
C = ROOT / "docs" / "contracts"
THEMES = {"sakura", "cyberpunk", "ombre"}
LAYERS = ["accessory_back", "guitar_back", "hair_back", "body", "bottom", "shoes",
          "top", "face", "hair_front", "accessory_front", "guitar_front"]
STATUSES = {"missing", "reference_only", "approved"}
HEX = re.compile(r"^#[0-9a-fA-F]{6}$")
ID = re.compile(r"^[a-z0-9_]+$")
errors = []


def err(msg):
    errors.append(msg)


def load(name):
    try:
        return json.loads((C / name).read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        err(f"{name}: illisible ({e})")
        return None


def png_size(path):
    b = path.read_bytes()[:24]
    if b[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return struct.unpack(">II", b[16:24])


# --- manifeste d'assets ---
m = load("asset-manifest.json")
if m:
    if m.get("canvas", {}).get("width") != 1024 or m["canvas"].get("height") != 1280:
        err("manifest: canevas doit être 1024x1280")
    if m.get("layerOrder") != LAYERS:
        err("manifest: layerOrder différent de la spec 04_ASSET_SPEC")
    if set(m.get("themes", [])) != THEMES or len(m["themes"]) != 3:
        err("manifest: exactement 3 thèmes requis (sakura, cyberpunk, ombre)")
    for ref in m.get("references", []):
        p = ROOT / ref["path"]
        if not p.is_file():
            err(f"manifest: référence absente {ref['path']}")
        elif ref.get("status") != "reference_only":
            err(f"manifest: {ref['id']} doit rester reference_only (planche aplatie)")
        elif png_size(p) != (ref["width"], ref["height"]):
            err(f"manifest: dimensions incorrectes pour {ref['path']}")
    ids = [a["id"] for a in m.get("avatars", [])]
    if sorted(ids) != ["boy", "girl"]:
        err("manifest: avatars attendus = boy, girl")
    for a in m.get("avatars", []):
        st = a.get("productionStatus")
        if st not in STATUSES:
            err(f"manifest: statut inconnu {st} pour {a['id']}")
        if st == "approved" and not a.get("baseImage"):
            err(f"manifest: {a['id']} approved sans baseImage")
        for slot, items in a.get("slots", {}).items():
            for it in items:
                if it.get("status") == "approved":
                    for layer, path in it.get("layers", {}).items():
                        if layer not in LAYERS:
                            err(f"item {it['id']}: calque inconnu {layer}")
                        p = ROOT / path
                        if not p.is_file():
                            err(f"item {it['id']}: fichier manquant {path}")
                        elif png_size(p) != (1024, 1280):
                            err(f"item {it['id']}: {path} n'est pas en 1024x1280")

# --- thèmes ---
t = load("themes.json")
if t is not None:
    tids = [x.get("id") for x in t]
    if sorted(tids) != sorted(THEMES):
        err(f"themes.json: ids {tids} ≠ {sorted(THEMES)}")
    seen_legacy = set()
    for x in t:
        for k in ("bg", "surface", "ink", "accent", "accent2", "accent3"):
            if not HEX.match(x.get("tokens", {}).get(k, "")):
                err(f"theme {x.get('id')}: token {k} invalide")
        bg = x.get("background", {})
        if bg.get("status") not in STATUSES:
            err(f"theme {x.get('id')}: background.status invalide")
        if bg.get("status") == "approved" and not (bg.get("image") and (ROOT / bg["image"]).is_file()):
            err(f"theme {x.get('id')}: approved sans image existante")
        for lid in x.get("legacyThemeIds", []):
            if lid in seen_legacy:
                err(f"legacyThemeId {lid} mappé deux fois")
            seen_legacy.add(lid)

# --- exemple CharacterConfig ---
cfg = load("example-character-config.json")
if cfg:
    allowed = {"schemaVersion", "avatarId", "hair", "top", "bottom", "accessory", "guitar", "expression", "themeId"}
    if set(cfg) - allowed:
        err(f"CharacterConfig: champs inconnus {set(cfg) - allowed}")
    if cfg.get("schemaVersion") != 1:
        err("CharacterConfig: schemaVersion doit valoir 1")
    if cfg.get("avatarId") not in ("boy", "girl"):
        err("CharacterConfig: avatarId invalide")
    if "themeId" in cfg and cfg["themeId"] not in THEMES:
        err("CharacterConfig: themeId invalide")
    for k in ("hair", "top", "bottom", "accessory", "guitar"):
        v = cfg.get(k)
        if v is not None and not ID.match(v):
            err(f"CharacterConfig: id {k} invalide")

for name in ("character-config.schema.json", "theme-config.schema.json"):
    load(name)

print(f"Contrats Guitar Leveling : {len(errors)} erreur(s)")
for e in errors:
    print("-", e)
sys.exit(1 if errors else 0)
