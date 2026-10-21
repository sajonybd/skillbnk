import re
from pathlib import Path
SRC = Path("src")
def read(n): return (SRC / n).read_text()
def between(text, start, end):
    i = text.index(start); j = text.index(end, i)
    return text[i:j]
def replace_once(text, old, new):
    assert old in text, f"missing: {old[:80]}"
    return text.replace(old, new, 1)
def set_timing(text, keys, design, pace, prefix_pre):
    dur = "const DURATIONS = {\n" + "\n".join(f"  {k}: {design[k]}," for k in keys) + "\n};"
    text = re.sub(r"const DURATIONS = \{[^}]+\};", dur, text, count=1)
    text = re.sub(r"const VOICED: string\[\] = \[[^\]]*\];", "const VOICED: string[] = [];", text, count=1)
    pre = [k for k in keys if k in prefix_pre]; post = [k for k in keys if k not in prefix_pre]
    text = re.sub(r"const PRE = \[[^\]]*\] as const;[^\n]*", "const PRE = [" + ", ".join(f'"{k}"' for k in pre) + "] as const; // hook, BEFORE the intro", text, count=1)
    text = re.sub(r"const POST = \[[^\]]*\] as const;", "const POST = [" + ", ".join(f'"{k}"' for k in post) + "] as const;", text, count=1)
    text = re.sub(r"const DESIGN: Record<Key, number> = \{[^}]+\};", "const DESIGN: Record<Key, number> = { " + ", ".join(f"{k}: {design[k]}" for k in keys) + " };", text, count=1)
    text = re.sub(r"const PACE: Record<Key, number> = \{[^}]+\};", "const PACE: Record<Key, number> = { " + ", ".join(f"{k}: {pace[k]}" for k in keys) + " };", text, count=1)
    return text
def set_const(text, name, value):
    new, n = re.subn(rf'^const {name} = "[^"]*";', f'const {name} = {value!r};'.replace("'", '"'), text, count=1, flags=re.M)
    assert n, name
    return new
def scene_tag(text, scene, n, label=None, url=None):
    i = text.index(f"const {scene}: React.FC")
    j = text.find("\n};\n", i)
    body = text[i:j]
    body = re.sub(r"<PortalTag n=\{\d+\}", f"<PortalTag n={{{n}}}", body)
    if label: body = re.sub(r'(<PortalTag[^>]*?)label="[^"]*"', rf'\1label="{label}"', body)
    if url: body = re.sub(r'(<PortalTag[^>]*?)url="[^"]*"', rf'\1url="{url}"', body)
    return text[:i] + body + text[j:]
def rename_scene(text, old, new):
    return re.sub(rf"\b{old}\b", new, text)

def portal_tag_bottom_right(text):
    """House rule (2026-10-05): the portal tag sits small in the bottom-right corner so it never covers UI."""
    a = text.index("const PortalTag: React.FC")
    b = text.index("\n);\n", a) + 4
    new = '''const PortalTag: React.FC<{ n: number; label: string; url: string; opacity?: number }> = ({ n, label, url, opacity = 1 }) => (
  <div style={{ position: "absolute", right: 26, bottom: 26, display: "flex", alignItems: "center", gap: 10, opacity: opacity * 0.92, zIndex: 50, fontFamily: FONT, padding: "6px 16px 6px 6px", borderRadius: 999, background: "rgba(4,6,13,0.72)", border: "1px solid #2E5CF644", boxShadow: "0 6px 20px #0007" }}>
    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2E5CF6", color: "#fff", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
    <div style={{ fontSize: 15, fontWeight: 800, color: "#F1F5F9", letterSpacing: 1.2, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color: "#8A96B2" }}>· {url}</div>
  </div>
);
'''
    return text[:a] + new + text[b:]
