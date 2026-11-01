"""Generate the README images in this directory.

    python3 assets/build.py

Writes hero, architecture and benchmark images in light and dark variants, and
one terminal image. Everything is plain SVG with system fonts, so GitHub renders
it without external resources.
"""
from pathlib import Path
from html import escape

OUT = Path(__file__).resolve().parent
SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
MONO = "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', 'DejaVu Sans Mono', monospace"

THEMES = {
    "light": dict(
        panel="#F4F7FA", edge="#D8E0E8", ink="#14202E", text="#3B4A5A", muted="#6B7A8A",
        track="#B9C6D3", card="#FFFFFF", blue="#2F7FCF", green="#23905A", amber="#C27A12",
        slate="#7D8B99", surface="#FFFFFF", grid="#E3E8EE", p50="#3D8FD6", p95="#D0861B",
    ),
    "dark": dict(
        panel="#121A24", edge="#26313D", ink="#E8EEF4", text="#B5C1CD", muted="#8796A6",
        track="#3A4859", card="#18222E", blue="#5AA2E8", green="#3DB57A", amber="#E2A23C",
        slate="#8D9BAA", surface="#0D1117", grid="#222C37", p50="#4A93D6", p95="#C9821C",
    ),
}


def svg(w, h, body, label):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
            f'role="img" aria-label="{escape(label)}">\n<title>{escape(label)}</title>\n{body}\n</svg>\n')


def text(x, y, s, size, fill, weight=400, anchor="start", family=SANS, extra=""):
    return (f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}" {extra}>{escape(s)}</text>')


# --- Hero -------------------------------------------------------------------

def hero(t):
    w, h = 1280, 420
    b = [f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="18" fill="{t["panel"]}" stroke="{t["edge"]}"/>']
    # Title block
    b.append(text(72, 150, "cc-super-agent", 60, t["ink"], 700, extra='letter-spacing="-1.5"'))
    b.append(text(74, 200, "Super-agent for Claude Code", 28, t["blue"], 600))
    b.append(text(74, 262, "Talk to one agent.", 21, t["text"]))
    b.append(text(74, 292, "It runs every other Claude Code session for you.", 21, t["text"]))
    b.append(text(74, 350, "Router–Worker architecture after DeepSeek’s Super-agent design", 15, t["muted"]))

    # Junction: you -> Router -> lanes
    rx, ry = 790, 210
    b.append(f'<line x1="652" y1="{ry}" x2="{rx-36}" y2="{ry}" stroke="{t["blue"]}" stroke-width="4" stroke-linecap="round"/>')
    b.append(f'<rect x="596" y="{ry-19}" width="56" height="38" rx="19" fill="{t["card"]}" stroke="{t["edge"]}"/>')
    b.append(text(624, ry + 6, "You", 16, t["ink"], 600, "middle"))
    lanes = [
        ("homepage", "PR #42 ready", t["green"], True),
        ("api", "running tests", t["slate"], True),
        ("paper", "needs your call", t["amber"], True),
        ("infra", "queued", t["slate"], False),
    ]
    ys = [86, 168, 252, 334]
    lx = 950
    for (name, status, color, filled), y in zip(lanes, ys):
        b.append(f'<path d="M {rx+34} {ry} C {rx+100} {ry}, {lx-90} {y}, {lx} {y}" fill="none" '
                 f'stroke="{t["track"]}" stroke-width="3" stroke-linecap="round"/>')
    b.append(f'<circle cx="{rx}" cy="{ry}" r="38" fill="{t["blue"]}"/>')
    b.append(f'<circle cx="{rx}" cy="{ry}" r="38" fill="none" stroke="{t["panel"]}" stroke-width="4" opacity="0.35"/>')
    b.append(text(rx, ry + 6, "Router", 15, "#FFFFFF", 700, "middle"))
    for (name, status, color, filled), y in zip(lanes, ys):
        b.append(f'<rect x="{lx}" y="{y-24}" width="270" height="48" rx="12" fill="{t["card"]}" stroke="{t["edge"]}"/>')
        b.append(text(lx + 18, y + 6, name, 17, t["ink"], 600))
        dot = (f'<circle cx="{lx+132}" cy="{y}" r="5" fill="{color}"/>' if filled else
               f'<circle cx="{lx+132}" cy="{y}" r="4.5" fill="none" stroke="{color}" stroke-width="2"/>')
        b.append(dot)
        b.append(text(lx + 144, y + 5, status, 14, t["text"]))
    return svg(w, h, "\n".join(b), "cc-super-agent: Super-agent for Claude Code. Talk to one agent; it runs every other Claude Code session for you.")


# --- Architecture -----------------------------------------------------------

def box(x, y, w, h, t, title, sub=None, accent=None, dashed=False):
    stroke = accent or t["edge"]
    dash = ' stroke-dasharray="6 5"' if dashed else ""
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{t["card"]}" stroke="{stroke}" stroke-width="{2 if accent else 1.5}"{dash}/>']
    ty = y + (h / 2 + 6 if not sub else h / 2 - 4)
    out.append(text(x + w / 2, ty, title, 18, t["ink"], 650, "middle"))
    if sub:
        for i, line in enumerate(sub if isinstance(sub, list) else [sub]):
            out.append(text(x + w / 2, ty + 24 + i * 20, line, 14, t["muted"], 400, "middle"))
    return "\n".join(out)


def arrow(x1, y1, x2, y2, color, dashed=False, width=2.5, curve=None):
    dash = ' stroke-dasharray="7 6"' if dashed else ""
    d = f"M {x1} {y1} L {x2} {y2}" if not curve else f"M {x1} {y1} C {curve} {x2} {y2}"
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}"{dash} '
            f'stroke-linecap="round" marker-end="url(#head-{color[1:]})"/>')


def markers(colors):
    return "<defs>" + "".join(
        f'<marker id="head-{c[1:]}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
        f'<path d="M 0 1 L 9 5 L 0 9 z" fill="{c}"/></marker>' for c in colors) + "</defs>"


def architecture(t):
    w, h = 1280, 660
    b = [markers([t["blue"], t["muted"], t["amber"]])]
    b.append(f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="18" fill="{t["panel"]}" stroke="{t["edge"]}"/>')

    # You
    b.append(box(60, 230, 140, 80, t, "You"))
    # Router (kept alive by tmux + systemd)
    b.append(f'<rect x="300" y="170" width="330" height="200" rx="18" fill="none" stroke="{t["track"]}" stroke-dasharray="4 6"/>')
    b.append(text(316, 196, "tmux under systemd: always on", 13, t["muted"]))
    b.append(box(330, 214, 270, 112, t, "Router", ["Claude Code session in the hub", "routes, records, never does the work"], accent=t["blue"]))
    b.append(arrow(200, 258, 326, 258, t["blue"]))
    b.append(arrow(326, 286, 204, 286, t["blue"]))
    b.append(text(263, 246, "talk", 13, t["muted"], anchor="middle"))

    # Records and memory
    b.append(box(300, 430, 210, 92, t, "Records", "INDEX.md, tasks/, projects/"))
    b.append(box(526, 430, 150, 92, t, "Memory", "your preferences"))
    b.append(f'<line x1="420" y1="330" x2="405" y2="426" stroke="{t["track"]}" stroke-width="2"/>')
    b.append(f'<line x1="540" y1="330" x2="590" y2="426" stroke="{t["track"]}" stroke-width="2"/>')

    # Workers
    workers = [("Worker: project A", "bin/dispatch, claude -p"), ("Worker: project B", "bin/dispatch, claude -p"),
               ("Your open session: project C", "SendMessage")]
    wy = [70, 230, 390]
    for (title, sub), y in zip(workers, wy):
        b.append(box(860, y, 340, 96, t, title, sub))
    for y in wy:
        b.append(f'<path d="M 606 270 C 720 270, 740 {y+48}, 852 {y+48}" fill="none" stroke="{t["blue"]}" '
                 f'stroke-width="2.5" stroke-linecap="round" '
                 f'marker-end="url(#head-{t["blue"][1:]})"/>')
    b.append(arrow(640, 270, 608, 270, t["blue"]))
    b.append(text(700, 508, "out: your words, verbatim", 13, t["blue"], 600))
    b.append(text(700, 526, "back: Status, Result, one Question", 13, t["muted"], 600))

    # Watchdog
    b.append(box(860, 530, 340, 100, t, "Watchdog", ["cron, every 15 minutes,", "watches Workers and the Router"], accent=t["amber"], dashed=True))
    b.append(arrow(856, 590, 420, 528, t["amber"], dashed=True, width=2, curve="640 600, 450 590,"))
    b.append(text(640, 616, "⚠ findings", 14, t["amber"], 600, "middle"))
    return svg(w, h, "\n".join(b), "Architecture: you talk to the Router; the Router dispatches your words to Worker sessions in project directories and keeps records; Workers report back; a cron-driven Watchdog observes Workers and the Router and writes findings to the records.")


# --- Terminal ---------------------------------------------------------------

def terminal():
    w, h = 1000, 430
    bg, bar, fg, dim = "#0F151C", "#1A222C", "#DCE3EA", "#7F8C99"
    you, router, q = "#E8EEF4", "#6CB1F0", "#E8A94A"
    b = [f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="14" fill="{bg}" stroke="#2A3440"/>',
         f'<path d="M 15 1 H {w-15} A 14 14 0 0 1 {w-1} 15 V 44 H 1 V 15 A 14 14 0 0 1 15 1 Z" fill="{bar}"/>']
    for i, c in enumerate(["#E5605A", "#E6B13F", "#4DB563"]):
        b.append(f'<circle cx="{28 + i*22}" cy="23" r="6.5" fill="{c}"/>')
    b.append(text(w / 2, 28, "~/super-agent  —  claude", 14, dim, 500, "middle", MONO))
    lines = [
        ("You    ", you, "The homepage title is too small, make it bigger.", fg),
        ("Router ", router, "On it: the homepage Worker will make the title font larger.", fg),
        None,
        ("You    ", you, "Also, did the CI fix in the api repo go through?", fg),
        ("Router ", router, "Not yet. That Worker is still running the test suite.", fg),
        None,
        ("", dim, "… twenty minutes later …", dim),
        None,
        ("Router ", router, "The homepage title is larger; PR #42 is ready for review.", fg),
        ("       ", router, "Question: the larger title wraps on mobile.", q),
        ("       ", router, "Shorten it, or allow two lines?", q),
    ]
    y = 92
    for line in lines:
        if line is None:
            y += 18
            continue
        who, wc, msg, mc = line
        if who.strip():
            b.append(text(36, y, who.strip(), 17, wc, 700, family=MONO))
        b.append(text(36 if not who else 124, y, msg, 17, mc, family=MONO))
        y += 30
    b.append(f'<rect x="36" y="{y-14}" width="10" height="20" fill="{router}" opacity="0.8"/>')
    return svg(w, h, "\n".join(b), "An illustrative session: the Router confirms new work in one sentence, answers a status question, and later reports a result with one question.")


# --- Benchmark (dumbbell: p50 to p95) ---------------------------------------

ROWS = [
    ("Super-agent", "", 12.4, 15.7),
    ("Super-agent without pass-through", "the setup closest to cc-super-agent", 12.6, 15.5),
    ("Single session + subagent tool", "delegate-first prompt", 13.8, 29.0),
    ("Single session + subagent tool", "neutral prompt", 20.4, 29.5),
]


def benchmark(t):
    w, h = 1000, 420
    x0, x1 = 400, 940          # plot area
    vmax = 32
    sx = lambda v: x0 + (x1 - x0) * v / vmax
    b = [f'<rect x="1" y="1" width="{w-2}" height="{h-2}" rx="14" fill="{t["surface"]}" stroke="{t["edge"]}"/>']
    b.append(text(32, 48, "Time to finish a work request, in minutes", 20, t["ink"], 650))
    b.append(text(32, 74, "Lower is better. Mean of 5 runs, about 300 messages and 20 work requests each.", 14, t["muted"]))
    # Legend
    lx = 32
    b.append(f'<circle cx="{lx+6}" cy="104" r="6" fill="{t["p50"]}"/>')
    b.append(text(lx + 18, 109, "median (p50)", 14, t["text"]))
    b.append(f'<circle cx="{lx+136}" cy="104" r="6" fill="{t["p95"]}"/>')
    b.append(text(lx + 148, 109, "slowest 5% (p95)", 14, t["text"]))
    top, step = 150, 56
    # Grid
    for v in range(0, 31, 5):
        x = sx(v)
        b.append(f'<line x1="{x}" y1="{top-22}" x2="{x}" y2="{top + step*len(ROWS) - 18}" stroke="{t["grid"]}" stroke-width="1"/>')
        b.append(text(x, top + step * len(ROWS) + 2, str(v), 13, t["muted"], anchor="middle"))
    for i, (name, note, p50, p95) in enumerate(ROWS):
        y = top + i * step
        b.append(text(32, y + (0 if note else 5), name, 15, t["ink"], 600))
        if note:
            b.append(text(32, y + 19, note, 13, t["muted"]))
        b.append(f'<line x1="{sx(p50)}" y1="{y}" x2="{sx(p95)}" y2="{y}" stroke="{t["track"]}" stroke-width="2" stroke-linecap="round"/>')
        for v, c, dy in ((p50, t["p50"], -12), (p95, t["p95"], -12)):
            b.append(f'<circle cx="{sx(v)}" cy="{y}" r="7" fill="{c}" stroke="{t["surface"]}" stroke-width="2"/>')
            b.append(text(sx(v), y + dy, f"{v:.1f}", 13, t["text"], 600, "middle"))
    b.append(text(32, h - 22, "Source: DeepSeek Harness team, “Exploring Super-agent Design”, section 7.1. Synthetic load; coding replaced by a timed tool.", 12, t["muted"]))
    return svg(w, h, "\n".join(b), "Dot plot of task completion time. Super-agent: median 12.4, p95 15.7 minutes. Without pass-through: 12.6 and 15.5. Single session with subagent tool, delegate-first prompt: 13.8 and 29.0. Neutral prompt: 20.4 and 29.5.")


def main():
    for name, t in THEMES.items():
        (OUT / f"hero-{name}.svg").write_text(hero(t))
        (OUT / f"architecture-{name}.svg").write_text(architecture(t))
        (OUT / f"benchmark-{name}.svg").write_text(benchmark(t))
    (OUT / "session.svg").write_text(terminal())


if __name__ == "__main__":
    main()
