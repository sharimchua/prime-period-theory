import os
import re

def fix_links():
    index_mdx = 'docs/src/pages/topics/index.mdx'
    with open(index_mdx, 'r', encoding='utf-8') as f:
        content = f.read()

    # Create mapping of old filename to new OKF route path
    # e.g. "engine-of-music.md" -> "/reference/foundations/..."?
    # Actually wait, let's find where these files went.
    pass
fix_links()
