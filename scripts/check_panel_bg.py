#!/usr/bin/env python3
"""Contrôle un décor de panneau reçu (art/incoming/panel_bg_<thème>.png) et, avec --install,
le copie dans public/art/panel/ (jamais d'URL externe en production).

Usage : python3 scripts/check_panel_bg.py art/incoming/panel_bg_sakura.png [--install]
"""
import hashlib
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parent.parent
EXPECTED = (1400, 620)
THEMES = ("sakura", "cyberpunk", "ombre")


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    src = Path(sys.argv[1])
    ok = True
    name = src.name
    theme = name.removeprefix("panel_bg_").removesuffix(".png")
    if theme not in THEMES or not name.startswith("panel_bg_"):
        print(f"ÉCHEC  nom de fichier inattendu : {name} (attendu panel_bg_<sakura|cyberpunk|ombre>.png)")
        ok = False
    im = Image.open(src)
    print(f"Format {im.format}, mode {im.mode}, taille {im.size[0]}×{im.size[1]}")
    if im.format != "PNG":
        print("ÉCHEC  le fichier n'est pas un PNG"); ok = False
    if im.size != EXPECTED:
        print(f"ÉCHEC  taille {im.size} ≠ {EXPECTED}"); ok = False
    rgba = im.convert("RGBA")
    a = rgba.getchannel("A")
    if a.getextrema()[0] < 250:
        print("ÉCHEC  le décor contient de la transparence (il doit être opaque)"); ok = False
    rgb = rgba.convert("RGB")
    w, h = rgb.size
    # Zone centrale basse (où se tient le héros) : contraste local à surveiller
    hero = rgb.crop((int(w * 0.40), int(h * 0.12), int(w * 0.60), int(h * 0.90)))
    side = rgb.crop((0, int(h * 0.12), int(w * 0.20), int(h * 0.90)))
    sh, ss = ImageStat.Stat(hero.convert("L")).stddev[0], ImageStat.Stat(side.convert("L")).stddev[0]
    print(f"Contraste zone héros (écart-type luminance) : {sh:.1f} · bord gauche : {ss:.1f}")
    if sh > 60:
        print("ALERTE zone centrale très contrastée : le personnage risque de se perdre dans le décor")
    sha = hashlib.sha256(src.read_bytes()).hexdigest()
    print(f"SHA-256 {sha}")
    if ok and "--install" in sys.argv:
        dst = ROOT / "public" / "art" / "panel" / name
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
        print(f"Installé : {dst.relative_to(ROOT)}  → passer le statut à 'candidate' dans src/appearance/worlds.ts")
    print("RÉSULTAT", "OK" if ok else "ÉCHEC")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
