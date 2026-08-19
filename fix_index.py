import re

mapping = {
    "engine-of-music.md": "/reference/foundations/periodicity/",
    "prime-families.md": "/reference/foundations/prime-families/",
    "auditory-horizon.md": "/reference/perception/auditory-horizon/",
    "temporal-place-limen.md": "/reference/perception/temporal-place-limen/",
    "information-and-expectation.md": "/reference/perception/information-and-expectation/",
    "harmonic-series-intro.md": "/reference/domains/rhythmic-overtone-series/",
    "frequencies-and-intervals.md": "/reference/domains/pitch/",
    "scales-and-tetrachords.md": "/reference/tuning/tetrachord-pairs/",
    "consonance-and-dissonance.md": "/reference/perception/local-closure/",
    "evolution-of-harmony.md": "/reference/structure/spatial-harmony/",
    "history-of-tuning.md": "/reference/tuning/12-tet/",
    "just-intonation-microtonality.md": "/reference/tuning/just-intonation/",
    "the-pulse.md": "/reference/foundations/periodicity/",
    "subdivision-and-metre.md": "/reference/domains/rhythm/",
    "syncopation.md": "/reference/domains/rhythm/",
    "polyrhythm.md": "/reference/domains/polymetric-phase-equivalence/",
    "swing-and-micro-timing.md": "/reference/domains/rhythm/",
    "dynamics-and-amplitude-shaping.md": "/reference/domains/dynamics/",
    "complex-spectrum.md": "/reference/domains/timbre/",
    "spectral-dynamic-coupling.md": "/reference/extended/spectral-dynamic-coupling/",
    "describing-structure.md": "/reference/structure/tapestry/",
    "uniform-solfege-chromatic-clock.md": "/reference/uniform-solfege/index/",
    "three-layer-coil.md": "/reference/structure/coil-notation/",
    "ppd.md": "/reference/ppd/index/",
}

with open('docs/src/pages/topics/index.mdx', 'r') as f:
    lines = f.readlines()

new_lines = []
pattern = re.compile(r'\]\(\.\/([^/]+)\/([^)]+\.md)\)')
for line in lines:
    match = pattern.search(line)
    if match:
        filename = match.group(2)
        if filename in mapping:
            line = pattern.sub(f']({mapping[filename]})', line)
        else:
            print(f"Warning: no mapping for {filename}")

    # Also fix absolute links to /topics/patterns-in-time
    line = line.replace('](/topics/patterns-in-time)', '](/topics/patterns-in-time/)')

    new_lines.append(line)

with open('docs/src/pages/topics/index.mdx', 'w') as f:
    f.writelines(new_lines)
