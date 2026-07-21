import os
import json
import re
from pathlib import Path

# Run linter logic to get missing links
import subprocess

OKF_DIR = Path('okf')

def extract_context(filepath, target_link):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find lines containing the target link
        lines = content.split('\n')
        for i, line in enumerate(lines):
            # We want to match markdown links: [text](target)
            # The target_link from the linter is a resolved relative path (e.g. uniform-solfege/diacritic-system.md)
            # The actual markdown link might be relative (e.g. ../uniform-solfege/diacritic-system.md)
            # So we just search for the basename in the line if it has a markdown link format
            basename = os.path.basename(target_link)
            if basename in line and '](' in line:
                # Extract paragraph (from previous empty line to next empty line)
                start = i
                while start > 0 and lines[start].strip() != '':
                    start -= 1
                if start > 0: start += 1
                
                end = i
                while end < len(lines) and lines[end].strip() != '':
                    end += 1
                    
                context = '\n'.join(lines[start:end]).strip()
                return context
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return "Context could not be extracted."

def main():
    print("Reading missing links from lint_output.txt...")
    with open('lint_output.txt', 'r', encoding='utf-16') as f:
        output = f.read()
    
    missing_links = []
    
    for line in output.split('\n'):
        if '(link-in-graph)' in line:
            # Example line: [WARN] [WARNING] tuning/du-fractal-dutri-closure.md: Inline link to 'tuning/just-intonation.md' is not mapped in typed relationships (link-in-graph)
            match = re.search(r'\[WARNING\] (.*?): Inline link to \'(.*?)\' is not mapped', line)
            if match:
                source_rel = match.group(1)
                target_rel = match.group(2)
                
                source_path = OKF_DIR / source_rel
                context = extract_context(source_path, target_rel)
                
                missing_links.append({
                    'source': source_rel,
                    'target': target_rel,
                    'context': context
                })
                
    with open('missing_links.json', 'w', encoding='utf-8') as f:
        json.dump(missing_links, f, indent=2)
        
    print(f"Extracted {len(missing_links)} missing links to missing_links.json")

if __name__ == '__main__':
    main()
