#!/usr/bin/env python3
"""Verify the handoff contents with Python stdlib; no network or image edits."""
from pathlib import Path
import hashlib,json,struct,sys
root=Path(__file__).resolve().parent.parent
m=json.loads((root/'MANIFEST.json').read_text(encoding='utf-8'))
errors=[]
for f in m['files']:
    p=root/f['path']
    if not p.is_file():errors.append('MISSING '+f['path']);continue
    if p.stat().st_size!=f['bytes']:errors.append('SIZE '+f['path'])
    if hashlib.sha256(p.read_bytes()).hexdigest()!=f['sha256']:errors.append('SHA256 '+f['path'])
    if p.suffix.lower()=='.png':
        b=p.read_bytes()[:24]
        if b[:8]!=b'\x89PNG\r\n\x1a\n' or b[12:16]!=b'IHDR':errors.append('PNG '+f['path'])
print(f"Guitar Leveling handoff: {len(m['files'])} contrôlés; {len(errors)} erreur(s)")
for e in errors:print('-',e)
sys.exit(bool(errors))
