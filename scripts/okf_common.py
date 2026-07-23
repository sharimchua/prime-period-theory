"""
okf_common.py — Shared utilities for OKF linting and analysis.

Single source of truth for parsing, constants, and graph helpers used by
both okf_lint.py and okf_analyse.py.
"""

import os
import re
import yaml
from collections import defaultdict

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

OKF_DIR = "okf"

REQUIRED_KEYS = ["type", "title", "description", "tags", "timestamp", "status"]

ALLOWED_TYPES = {"index", "concept", "reference", "glossary", "specification"}

ALLOWED_STATUSES = {"stable", "experimental", "draft", "deprecated", "stub"}

ALLOWED_EVIDENCES = {
    "mathematical", "empirical", "historical",
    "pedagogical", "design", "speculative",
}

TYPED_RELS = [
    "depends_on",
    "extends",
    "contrasts_with",
    "used_by",
    "implemented_by",
    "pedagogically_precedes",
]

# ---------------------------------------------------------------------------
# Finding class
# ---------------------------------------------------------------------------

class Finding:
    """A single lint or analysis finding."""

    def __init__(self, severity, check_id, filepath, message):
        self.severity = severity      # "error" | "warning" | "info"
        self.check_id = check_id
        self.filepath = filepath
        self.message = message

    def to_dict(self):
        return {
            "severity": self.severity,
            "check_id": self.check_id,
            "filepath": self.filepath,
            "message": self.message,
        }

# ---------------------------------------------------------------------------
# File parsing
# ---------------------------------------------------------------------------

def parse_file(filepath):
    """Parse an OKF markdown file, returning frontmatter, body, links and
    lightweight structural metrics."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    frontmatter = None
    body = content
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1])
            except Exception:
                pass
            body = parts[2]

    # Extract markdown links [text](path)
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', body)

    # Structural metrics for analysis
    h2_count = len(re.findall(r'^##\s+(.*)', body, flags=re.MULTILINE))

    return {
        "frontmatter": frontmatter,
        "body": body,
        "links": links,
        "h2_count": h2_count,
        "chars": len(body),
    }

# ---------------------------------------------------------------------------
# File discovery
# ---------------------------------------------------------------------------

SKIP_FILES = {"AGENTS.md", "analysis.md"}


def walk_okf_files(okf_dir=OKF_DIR):
    """Yield (rel_path, full_path) for every .md file in the OKF directory,
    excluding AGENTS.md and auto-generated files."""
    for root, _, files in os.walk(okf_dir):
        for file in files:
            if file.endswith(".md") and file not in SKIP_FILES:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, okf_dir).replace("\\", "/")
                yield rel_path, full_path

# ---------------------------------------------------------------------------
# Graph utilities
# ---------------------------------------------------------------------------

def check_cycles(graph):
    """Detect cycles in a directed graph represented as {node: [neighbours]}.
    Returns a list of cycles, each being a list of nodes forming the loop."""
    visited = set()
    rec_stack = set()
    cycles = []

    def dfs(node, path):
        visited.add(node)
        rec_stack.add(node)
        path.append(node)

        for neighbour in graph.get(node, []):
            if neighbour not in visited:
                dfs(neighbour, path)
            elif neighbour in rec_stack:
                idx = path.index(neighbour)
                cycles.append(path[idx:] + [neighbour])

        rec_stack.remove(node)
        path.pop()

    for node in list(graph.keys()):
        if node not in visited:
            dfs(node, [])

    return cycles


def reachable_from(graph, start_nodes):
    """Return the set of all nodes reachable from *start_nodes* via BFS."""
    visited = set()
    queue = list(start_nodes)
    while queue:
        node = queue.pop(0)
        if node in visited:
            continue
        visited.add(node)
        for neighbour in graph.get(node, []):
            if neighbour not in visited:
                queue.append(neighbour)
    return visited
