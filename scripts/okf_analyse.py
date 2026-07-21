import os
import sys
import re
import yaml
import json
import argparse
from datetime import datetime
from collections import defaultdict

OKF_DIR = "okf"

def parse_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
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
    
    # Extract headings for cohesion estimate
    h2_count = len(re.findall(r'^##\s+(.*)', body, flags=re.MULTILINE))
    
    return {
        "frontmatter": frontmatter,
        "body": body,
        "links": links,
        "h2_count": h2_count,
        "chars": len(body)
    }

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
    for root, _, files in os.walk(OKF_DIR):
        for file in files:
            if file.endswith(".md") and not file.endswith("AGENTS.md"):
                rel_path = os.path.relpath(os.path.join(root, file), OKF_DIR).replace('\\', '/')
                all_files.add(rel_path)
                full_path = os.path.join(OKF_DIR, rel_path)
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
        for rel_key in ["depends_on", "extends", "used_by", "implemented_by"]:
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

    # Determine primary edges (use typed if available, else inferred)
    edges = typed_edges if len(typed_edges) > 0 else inferred_edges
    
    fan_out = defaultdict(int)
    fan_in = defaultdict(int)
    
    for src, targets in edges.items():
        fan_out[src] += len(targets)
        for tgt in targets:
            fan_in[tgt] += 1

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
            "h2_sections": h2,
            "size_chars": chars
        })
        
    metrics.sort(key=lambda x: x["fan_in"], reverse=True)
    
    # Calculate Depth
    depth_memo = {}
    def get_depth(node):
        if node in depth_memo:
            return depth_memo[node]
        if not edges.get(node):
            return 0
        max_d = 0
        for tgt in edges[node]:
            # simple cycle break for depth
            depth_memo[node] = 0 
            max_d = max(max_d, get_depth(tgt))
        depth = max_d + 1
        depth_memo[node] = depth
        return depth
        
    for file in all_files:
        get_depth(file)
        
    max_depth = max(depth_memo.values()) if depth_memo else 0

    # Write JSON report
    os.makedirs(output_dir, exist_ok=True)
    report_data = {
        "metrics": metrics,
        "god_concepts": god_concepts,
        "max_depth": max_depth,
        "status_distribution": dict(status_counts),
        "evidence_distribution": dict(evidence_counts),
    }
    
    with open(os.path.join(output_dir, "okf-analysis.json"), "w") as f:
        json.dump(report_data, f, indent=2)

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
                md.append(f"| {gc} | {gc_metric['fan_out']} | {gc_metric['size_chars']} | {gc_metric['h2_sections']} |")
            else:
                md.append(f"| {gc} | ? | ? | ? |")
    else:
        md.append("None detected.")
        
    md.extend([
        "",
        "## Metrics Top 15 (by Fan-in)",
        "| File | Fan-In | Fan-Out | Instability | H2 | Size |",
        "|------|--------|---------|-------------|----|------|"
    ])
    for m in metrics[:15]:
        md.append(f"| {m['file']} | {m['fan_in']} | {m['fan_out']} | {m['instability']} | {m['h2_sections']} | {m['size_chars']} |")
        
    md.extend([
        "", 
        "## Graph Topology",
        "The following diagram provides a visual representation of the core dependency graph (limited to the first 50 connections for readability).",
        "",
        "- **Nodes** represent individual OKF concept files.",
        "- **Arrows** represent a dependency relationship pointing from a source concept to its target.",
        "",
        "This topology helps visualize the structural flow of knowledge and identify foundational concepts that anchor the framework."
    ])
    md.append("```mermaid")
    md.append("graph TD")
    count = 0
    for src, targets in edges.items():
        if count > 50:
            break
        src_name = os.path.basename(src).replace('.md', '')
        for tgt in targets:
            tgt_name = os.path.basename(tgt).replace('.md', '')
            md.append(f"    {src_name} --> {tgt_name}")
            count += 1
    md.append("```")

    with open(os.path.join(output_dir, "okf-analysis.md"), "w", encoding='utf-8') as f:
        f.write("\n".join(md))
        
    with open(os.path.join("okf", "analysis.md"), "w", encoding='utf-8') as f:
        f.write("\n".join(md))

    # Write Summary PR report
    with open(os.path.join(output_dir, "okf-analysis-summary.md"), "w", encoding='utf-8') as f:
        f.write(f"### OKF Analysis Summary\n- Total Concepts: {len(all_files)}\n- Max Dependency Depth: {max_depth}\n- God Concepts Detected: {len(god_concepts)}\n- Typed Edges Used: {'Yes' if len(typed_edges) > 0 else 'No (inferred from markdown links)'}\n")

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
