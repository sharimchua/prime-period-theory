import os
import sys
import re
import json
import argparse
from datetime import datetime
from collections import defaultdict

from okf_common import (
    OKF_DIR, REQUIRED_KEYS, ALLOWED_TYPES, ALLOWED_STATUSES,
    ALLOWED_EVIDENCES, TYPED_RELS, Finding, parse_file,
    walk_okf_files, check_cycles,
)

def lint_okf(strict=False):
    findings = []
    
    if not os.path.exists(OKF_DIR):
        findings.append(Finding("error", "setup", "", f"Directory '{OKF_DIR}' not found."))
        return findings

    all_files = set()
    index_links = set()
    defines_map = defaultdict(list)
    doc_data = {}
    
    # Store edges for acyclic check
    depends_on_graph = defaultdict(list)

    pedagogy_graph = defaultdict(list)

    # Pass 1: Parse and collect files
    for rel_path, full_path in walk_okf_files():
        all_files.add(rel_path)
        
        data = parse_file(full_path)
        doc_data[rel_path] = data
        
        fm = data["frontmatter"]
        if fm:
            for d in fm.get("defines", []):
                defines_map[d].append(rel_path)
            
            depends = fm.get("depends_on", [])
            if depends:
                depends_on_graph[rel_path].extend(depends)
                
            pedagogical = fm.get("pedagogically_precedes", [])
            if pedagogical:
                pedagogy_graph[rel_path].extend(pedagogical)

    cycles = check_cycles(depends_on_graph)
    for cycle in cycles:
        cycle_str = " -> ".join(cycle)
        findings.append(Finding("error", "depends-acyclic", cycle[0], f"Dependency cycle detected: {cycle_str}"))

    pedagogy_cycles = check_cycles(pedagogy_graph)
    for cycle in pedagogy_cycles:
        cycle_str = " -> ".join(cycle)
        findings.append(Finding("error", "pedagogy-acyclic", cycle[0],
                                f"Pedagogical cycle detected: {cycle_str}"))

    # Pass 2: Rules
    for rel_path, data in doc_data.items():
        fm = data["frontmatter"]
        
        # Schema rules
        if fm is None:
            findings.append(Finding("error", "frontmatter-present", rel_path, "Missing or invalid frontmatter"))
            continue
            
        for key in REQUIRED_KEYS:
            if key not in fm:
                findings.append(Finding("error", "frontmatter-required", rel_path, f"Missing required key: '{key}'"))
                
        doc_type = fm.get("type")
        if doc_type and doc_type not in ALLOWED_TYPES:
            findings.append(Finding("error", "frontmatter-type", rel_path, f"Invalid type: '{doc_type}'"))
            
        ts = fm.get("timestamp")
        if ts:
            try:
                datetime.strptime(str(ts), "%Y-%m-%d")
            except ValueError:
                findings.append(Finding("error", "frontmatter-timestamp", rel_path, "Invalid timestamp format (use YYYY-MM-DD)"))

        status = fm.get("status")
        if status:
            if status not in ALLOWED_STATUSES:
                findings.append(Finding("warning", "frontmatter-status", rel_path, f"Invalid status: '{status}'"))
        else:
            findings.append(Finding("info", "frontmatter-status", rel_path, "Missing status field"))
            
        evidence = fm.get("evidence", [])
        if evidence:
            for ev in evidence:
                if ev not in ALLOWED_EVIDENCES:
                    findings.append(Finding("info", "frontmatter-evidence", rel_path, f"Unknown evidence type: '{ev}'"))
                    
        domain = fm.get("domain")
        expected_domain = os.path.dirname(rel_path).split('/')[0]
        if domain:
            if domain != expected_domain and expected_domain:
                findings.append(Finding("info", "frontmatter-domain", rel_path, f"Domain '{domain}' differs from dir '{expected_domain}'"))
        else:
            findings.append(Finding("info", "frontmatter-domain", rel_path, "Missing domain field"))

        # Typed Relationships
        has_typed_rels = False
        for rel_key in TYPED_RELS:
            targets = fm.get(rel_key, [])
            if targets:
                has_typed_rels = True
            for target in targets:
                if target not in all_files:
                    findings.append(Finding("error", "relationship-targets", rel_path, f"Broken '{rel_key}' link to '{target}'"))

        depends_count = len(fm.get("depends_on", []))
        if depends_count > 10:
            findings.append(Finding("warning", "fan-out", rel_path,
                                    f"High fan-out: {depends_count} depends_on entries (threshold: 10)"))

        # Exposition ratio check
        prose = re.sub(r'```[\s\S]*?```', '', data["body"])
        prose = re.sub(r'`[^`]+`', '', prose)
        prose_len = len(prose.strip())
        if prose_len > 8000:
            findings.append(Finding("info", "exposition-length", rel_path,
                                    f"Long exposition: {prose_len} chars of prose (threshold: 8000)"))

        if not has_typed_rels and rel_path != "index.md":
            findings.append(Finding("info", "no-orphan", rel_path, "No typed relationships defined"))
            
        # Markdown links
        file_dir = os.path.dirname(rel_path)
        for _, link in data["links"]:
            if link.startswith("http") or link.startswith("#") or link.startswith("mailto:"):
                continue
            
            # Resolve relative markdown links
            link_clean = link.split('#')[0]
            resolved_link = os.path.normpath(os.path.join(file_dir, link_clean)).replace('\\', '/')
            if resolved_link not in all_files:
                findings.append(Finding("error", "link-valid", rel_path, f"Broken markdown link to '{link}' (resolved: {resolved_link})"))
            elif resolved_link == rel_path:
                findings.append(Finding("warning", "no-self-link", rel_path, "File links to itself"))
            else:
                in_graph = False
                for rel_key in TYPED_RELS:
                    if resolved_link in fm.get(rel_key, []):
                        in_graph = True
                        break
                if not in_graph and rel_path != "index.md":
                    findings.append(Finding("warning", "link-in-graph", rel_path, f"Inline link to '{resolved_link}' is not mapped in typed relationships"))
                
            if rel_path == "index.md":
                index_links.add(resolved_link)

        # Structure
        if "## See also" not in data["body"] and rel_path != "index.md":
            findings.append(Finding("info", "see-also-present", rel_path, "Missing '## See also' section"))

    # Global checks
    for term, files in defines_map.items():
        if len(files) > 1:
            for f in files:
                findings.append(Finding("error", "defines-unique", f, f"Term '{term}' is multiply defined in {', '.join(files)}"))
                
    for file in all_files:
        if file != "index.md" and file not in index_links:
            findings.append(Finding("warning", "index-consistent", file, "Not linked from okf/index.md"))

    return findings

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="Output JSON")
    parser.add_argument("--strict", action="store_true", help="Treat warnings as errors")
    parser.add_argument("--migration-report", action="store_true", help="Show summary of missing new fields")
    args = parser.parse_args()

    # Move to script directory's parent to ensure 'okf' is in the right place
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(os.path.dirname(script_dir))

    findings = lint_okf(args.strict)
    
    if args.migration_report:
        missing_status = len([f for f in findings if f.check_id == "frontmatter-status" and f.severity == "info"])
        missing_domain = len([f for f in findings if f.check_id == "frontmatter-domain" and f.severity == "info"])
        no_rels = len([f for f in findings if f.check_id == "no-orphan" and f.severity == "info"])
        
        print("=== Migration Gap Report ===")
        print(f"Missing 'status' field: {missing_status} files")
        print(f"Missing 'domain' field: {missing_domain} files")
        print(f"No typed relationships: {no_rels} files")
        sys.exit(0)

    if args.json:
        print(json.dumps([f.to_dict() for f in findings], indent=2))
    else:
        has_errors = False
        for f in findings:
            if f.severity == "error" or (args.strict and f.severity == "warning"):
                print(f"[FAIL] [{f.severity.upper()}] {f.filepath}: {f.message} ({f.check_id})")
                has_errors = True
            elif f.severity != "info":
                print(f"[WARN] [{f.severity.upper()}] {f.filepath}: {f.message} ({f.check_id})")
                
        if has_errors:
            sys.exit(1)
            
if __name__ == "__main__":
    main()
