import os
from pathlib import Path

stubs = [
    'okf/pedagogy/learning-paths.md',
    'okf/pedagogy/progressive-complexity.md',
    'okf/applications/index.md',
    'okf/applications/visualisation.md',
    'okf/applications/transcription.md',
    'okf/reference/emergent-analysis.md',
    'okf/perception/self-adjusting-pipeline.md',
    'okf/structure/spatial-harmony.md'
]

template = """---
type: concept
title: {title}
description: >
  Stub concept page for {title}.
tags:
  - stub
timestamp: 2026-07-22

# Typed relationships
status: stub
domain: {domain}
depends_on: []
extends: []
contrasts_with: []
used_by: []
implemented_by: []
defines: []
evidence: []
---

# {title}

> [!NOTE]
> This concept page is currently a stub and will be expanded in the future.
"""

for stub in stubs:
    p = Path(stub)
    p.parent.mkdir(parents=True, exist_ok=True)
    if not p.exists():
        domain = p.parent.name if p.parent.name != 'okf' else 'root'
        title = p.stem.replace('-', ' ').title()
        
        # fix titles for specific files
        if p.stem == 'index':
            title = domain.title() + ' Index'
            type_val = 'index'
        else:
            type_val = 'concept'
            
        content = template.format(title=title, domain=domain).replace('type: concept', f'type: {type_val}')
        with open(p, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created {stub}")
    else:
        print(f"Skipped {stub} (already exists)")
