import os
import sys
import re
import json
import argparse
from datetime import datetime
from collections import defaultdict

from okf_common import (
    OKF_DIR, TYPED_RELS, parse_file, walk_okf_files,
    check_cycles, reachable_from, Finding,
)

def analyze_okf(output_dir):
    if not os.path.exists(OKF_DIR):
        print(f"Directory '{OKF_DIR}' not found.")
        return

    all_files = set()
    doc_data = {}
    
    inferred_edges = defaultdict(list)
    typed_edges = defaultdict(list)
    
    status_counts = defaultdict(int)
    evidence_counts = defaultdict(int)

    # Pass 1: Parse and collect files
    for rel_path, full_path in walk_okf_files(OKF_DIR):
        all_files.add(rel_path)
        doc_data[rel_path] = parse_file(full_path)

    # Pass 2: Build graph
    for rel_path, data in doc_data.items():
        fm = data["frontmatter"] or {}
        
        status = fm.get("status", "none")
        status_counts[status] += 1
        
        evidence = fm.get("evidence", [])
        for ev in evidence:
            evidence_counts[ev] += 1
            
        file_dir = os.path.dirname(rel_path)
        
        has_typed_rels = False
        for rel_key in TYPED_RELS:
            targets = fm.get(rel_key, [])
            for target in targets:
                if target in all_files:
                    typed_edges[rel_path].append(target)
                    has_typed_rels = True

        for _, link in data["links"]:
            if link.startswith("http") or link.startswith("#") or link.startswith("mailto:"):
                continue
            link_clean = link.split('#')[0]
            resolved_link = os.path.normpath(os.path.join(file_dir, link_clean)).replace('\\', '/')
            if resolved_link in all_files and resolved_link != rel_path:
                inferred_edges[rel_path].append(resolved_link)

    # Merge edges: prefer typed where available, fall back to inferred per-file
    edges = defaultdict(list)
    all_edge_files = set(typed_edges.keys()) | set(inferred_edges.keys())
    for f in all_edge_files:
        if f in typed_edges:
            edges[f] = typed_edges[f]
        else:
            edges[f] = inferred_edges[f]
    
    fan_out = defaultdict(int)
    fan_in = defaultdict(int)
    
    for src, targets in edges.items():
        fan_out[src] += len(targets)
        for tgt in targets:
            fan_in[tgt] += 1

    # Calculate depth with proper cycle handling
    depth_memo = {}

    def get_depth(node, visiting=None):
        if visiting is None:
            visiting = set()
        if node in depth_memo:
            return depth_memo[node]
        if node in visiting:
            return 0  # Cycle detected — break recursion
        visiting.add(node)
        max_d = 0
        for tgt in edges.get(node, []):
            max_d = max(max_d, get_depth(tgt, visiting))
        depth = max_d + 1 if edges.get(node) else 0
        visiting.discard(node)
        depth_memo[node] = depth
        return depth

    for file in all_files:
        get_depth(file)

    max_depth = max(depth_memo.values()) if depth_memo else 0

    metrics = []
    god_concepts = []
    
    for file in all_files:
        fi = fan_in[file]
        fo = fan_out[file]
        total = fi + fo
        instability = (fo / total) if total > 0 else 0
        
        h2 = doc_data[file]["h2_count"]
        chars = doc_data[file]["chars"]
        
        if (fi + fo) > 10 and chars > 5000:
            god_concepts.append(file)
            
        metrics.append({
            "file": file,
            "fan_in": fi,
            "fan_out": fo,
            "instability": round(instability, 2),
            "depth": depth_memo.get(file, 0),
            "complexity": fi + fo + depth_memo.get(file, 0),
            "h2_sections": h2,
            "size_chars": chars,
        })
        
    metrics.sort(key=lambda x: x["fan_in"], reverse=True)

    cohesion_warnings = []
    for file in all_files:
        h2 = doc_data[file]["h2_count"]
        if h2 > 8:
            cohesion_warnings.append({"file": file, "h2_sections": h2})

    # Build combined forward graph for reachability
    combined_graph = defaultdict(list)
    for src, targets in edges.items():
        combined_graph[src].extend(targets)
    # Also add reverse edges so we traverse both directions
    for src, targets in edges.items():
        for tgt in targets:
            combined_graph[tgt].append(src)

    foundation_files = {f for f in all_files if f.startswith("foundations/")}
    reachable = reachable_from(combined_graph, foundation_files)
    dead_concepts = [f for f in all_files if f not in reachable and f != "index.md"]

    # Duplication detection
    def extract_definitions(body):
        """Extract first paragraph after each ## heading."""
        defs = []
        sections = re.split(r'^## ', body, flags=re.MULTILINE)
        for section in sections[1:]:  # Skip content before first ##
            lines = section.strip().split('\n')
            # Skip the heading line itself
            para_lines = []
            for line in lines[1:]:
                stripped = line.strip()
                if stripped == '':
                    if para_lines:
                        break
                    continue
                para_lines.append(stripped)
            if para_lines:
                defs.append(' '.join(para_lines))
        return defs

    def jaccard_similarity(text_a, text_b):
        words_a = set(text_a.lower().split())
        words_b = set(text_b.lower().split())
        if not words_a or not words_b:
            return 0.0
        intersection = words_a & words_b
        union = words_a | words_b
        return len(intersection) / len(union)

    duplication_warnings = []
    file_defs = {}
    for f_path in all_files:
        defs = extract_definitions(doc_data[f_path]["body"])
        if defs:
            file_defs[f_path] = defs

    file_list = list(file_defs.keys())
    for i in range(len(file_list)):
        for j in range(i + 1, len(file_list)):
            f_a, f_b = file_list[i], file_list[j]
            for def_a in file_defs[f_a]:
                for def_b in file_defs[f_b]:
                    sim = jaccard_similarity(def_a, def_b)
                    if sim > 0.85 and len(def_a.split()) > 5:  # Ignore very short defs
                        duplication_warnings.append({
                            "file_a": f_a,
                            "file_b": f_b,
                            "similarity": round(sim, 2),
                            "text_a": def_a[:120],
                            "text_b": def_b[:120],
                        })

    coverage = {"examples": 0, "references": 0, "implementations": 0, "pedagogy": 0}
    total_concepts = len(all_files)
    for f_path in all_files:
        data = doc_data[f_path]
        fm = data["frontmatter"] or {}
        body = data["body"]
        if '```' in body or re.search(r'^##\s+[Ee]xample', body, re.MULTILINE):
            coverage["examples"] += 1
        if re.search(r'^##\s+(References|See also)', body, re.MULTILINE):
            coverage["references"] += 1
        if fm.get("implemented_by"):
            coverage["implementations"] += 1
        if fm.get("pedagogically_precedes") or fm.get("learning_stage"):
            coverage["pedagogy"] += 1

    coverage_pct = {k: round(v / total_concepts * 100, 1) if total_concepts else 0 for k, v in coverage.items()}

    foundational_concepts = [m["file"] for m in metrics if m["fan_in"] >= 5]

    # Pedagogical graph independence
    depends_edges = set()
    pedagogy_edges = set()
    for f_path in all_files:
        fm = (doc_data[f_path]["frontmatter"] or {})
        for tgt in fm.get("depends_on", []):
            depends_edges.add((f_path, tgt))
        for tgt in fm.get("pedagogically_precedes", []):
            pedagogy_edges.add((f_path, tgt))

    pedagogy_independence = True
    if pedagogy_edges and pedagogy_edges == depends_edges:
        pedagogy_independence = False
    # Also check subset: if pedagogy is a strict subset of depends_on with > 3 edges
    elif pedagogy_edges and len(pedagogy_edges) > 3 and pedagogy_edges.issubset(depends_edges):
        pedagogy_independence = False

    # Write JSON report
    os.makedirs(output_dir, exist_ok=True)
    report_data = {
        "metrics": metrics,
        "god_concepts": god_concepts,
        "foundational_concepts": foundational_concepts,
        "dead_concepts": dead_concepts,
        "cohesion_warnings": cohesion_warnings,
        "duplication_warnings": duplication_warnings,
        "coverage": coverage_pct,
        "pedagogy_independent": pedagogy_independence,
        "max_depth": max_depth,
        "status_distribution": dict(status_counts),
        "evidence_distribution": dict(evidence_counts),
    }
    
    with open(os.path.join(output_dir, "okf-analysis.json"), "w", encoding='utf-8') as f:
        json.dump(report_data, f, indent=2)

    # Write Interactive Graph JSON for Astro public dir
    graph_nodes = []
    graph_links = []
    for f_path in all_files:
        fm = doc_data[f_path]["frontmatter"] or {}
        title = fm.get("title", f_path)
        group = fm.get("domain") or (f_path.split("/")[0] if "/" in f_path else "root")
        if isinstance(group, list):
            group = group[0] if group else "root"
        doc_type = fm.get("type", "concept")
        status = fm.get("status", "none")
        graph_nodes.append({"id": f_path, "title": title, "group": group, "doc_type": doc_type, "status": status})
        
    for src, targets in edges.items():
        for tgt in targets:
            graph_links.append({"source": src, "target": tgt, "value": 1})
            
    docs_public = os.path.join("docs", "public")
    os.makedirs(docs_public, exist_ok=True)
    with open(os.path.join(docs_public, "okf-graph.json"), "w", encoding='utf-8') as f:
        json.dump({"nodes": graph_nodes, "links": graph_links}, f, indent=2)

    # Write Markdown full report
    md = [
        "---",
        "type: reference",
        "title: OKF Architectural Analysis",
        "description: Auto-generated graph metrics and health analysis of the OKF repository.",
        f"timestamp: {datetime.now().strftime('%Y-%m-%d')}",
        "tags:",
        "  - analytics",
        "  - graph",
        "status: stable",
        "depends_on: []",
        "extends: []",
        "contrasts_with: []",
        "used_by: []",
        "implemented_by: []",
        "defines: []",
        "evidence: []",
        "---",
        "# OKF Architectural Analysis",
        f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        "## God Concepts (Refactor Candidates)",
        "<div style=\"background-color: #fff3cd; color: #856404; padding: 1rem; border-left: 4px solid #ffeeba; margin-bottom: 1rem; border-radius: 4px;\">",
        "<strong>⚠️ WARNING:</strong> <strong>God Concepts</strong> are files that are unusually large and have a very high number of outgoing links (Fan-Out). They are problematic because they centralize too much information, making them difficult to maintain and violating the Open Knowledge Format principle of atomicity. If a concept appears here, consider breaking it down into smaller, more focused pages.",
        "</div>",
        ""
    ]
    if god_concepts:
        md.append("| File | Fan-Out | Size (chars) | H2 Sections |")
        md.append("|------|---------|--------------|-------------|")
        for gc in god_concepts:
            gc_metric = next((m for m in metrics if m['file'] == gc), None)
            if gc_metric:
                md.append(f"| [{gc}]({gc}) | {gc_metric['fan_out']} | {gc_metric['size_chars']} | {gc_metric['h2_sections']} |")
            else:
                md.append(f"| [{gc}]({gc}) | ? | ? | ? |")
    else:
        md.append("None detected.")
        
    md.extend([
        "",
        "## Metrics Top 15 (by Fan-in)",
        "| File | Fan-In | Fan-Out | Instability | Depth | Complexity | H2 | Size |",
        "|------|--------|---------|-------------|-------|------------|----|------|"
    ])
    for m in metrics[:15]:
        md.append(f"| [{m['file']}]({m['file']}) | {m['fan_in']} | {m['fan_out']} | {m['instability']} | {m['depth']} | {m['complexity']} | {m['h2_sections']} | {m['size_chars']} |")
        
    md.extend([
        "", 
        "## Graph Topology",
        "The complete graph topology is rendered interactively below using the `KnowledgeGraphViewer` Astro component, providing a visual representation of the core dependency graph.",
        "",
        "## Dead Concepts",
    ])
    if dead_concepts:
        for dc in dead_concepts:
            md.append(f"- [{dc}]({dc})")
    else:
        md.append("None detected.")

    md.extend([
        "",
        "## Cohesion Warnings",
        "| File | H2 Sections |",
        "|------|-------------|"
    ])
    for cw in cohesion_warnings:
        md.append(f"| [{cw['file']}]({cw['file']}) | {cw['h2_sections']} |")

    md.extend([
        "",
        "## Duplication Warnings",
        "| File A | File B | Similarity | Text A Snippet |",
        "|--------|--------|------------|----------------|"
    ])
    for dw in duplication_warnings:
        md.append(f"| [{dw['file_a']}]({dw['file_a']}) | [{dw['file_b']}]({dw['file_b']}) | {dw['similarity']} | {dw['text_a'][:50]}... |")

    md.extend([
        "",
        "## Coverage",
        "| Metric | Percentage |",
        "|--------|------------|",
        f"| Examples | {coverage_pct['examples']}% |",
        f"| References | {coverage_pct['references']}% |",
        f"| Implementations | {coverage_pct['implementations']}% |",
        f"| Pedagogy | {coverage_pct['pedagogy']}% |",
        "",
        "## Foundational Concepts",
    ])
    for fc in foundational_concepts:
        md.append(f"- [{fc}]({fc})")
        
    md.extend([
        "",
        "## Pedagogical Independence",
        f"{'✅ Yes' if pedagogy_independence else '⚠️ No — mirrors depends_on'}"
    ])

    with open(os.path.join(output_dir, "okf-analysis.md"), "w", encoding='utf-8') as f:
        f.write("\n".join(md))
        
    with open(os.path.join("okf", "analysis.md"), "w", encoding='utf-8') as f:
        f.write("\n".join(md))

    # Write Summary PR report
    with open(os.path.join(output_dir, "okf-analysis-summary.md"), "w", encoding='utf-8') as f:
        f.write(f"### OKF Analysis Summary\n")
        f.write(f"- Total Concepts: {len(all_files)}\n")
        f.write(f"- Max Dependency Depth: {max_depth}\n")
        f.write(f"- God Concepts: {len(god_concepts)}\n")
        f.write(f"- Dead Concepts: {len(dead_concepts)}\n")
        f.write(f"- Duplication Warnings: {len(duplication_warnings)}\n")
        f.write(f"- Coverage — Examples: {coverage_pct['examples']}%, References: {coverage_pct['references']}%, Implementations: {coverage_pct['implementations']}%, Pedagogy: {coverage_pct['pedagogy']}%\n")
        f.write(f"- Pedagogy Independent: {'Yes' if pedagogy_independence else '⚠️ No — mirrors depends_on'}\n")

    print(f"Analysis complete. Reports generated in '{output_dir}/'")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="reports", help="Output directory")
    args = parser.parse_args()
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(os.path.dirname(script_dir))

    analyze_okf(args.output)
    
if __name__ == "__main__":
    main()
