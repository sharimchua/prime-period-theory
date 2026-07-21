import os
import re
import subprocess

def parse_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not match: return None, content, None
    fm_str = match.group(1)
    
    list_items = {}
    current_key = None
    for line in fm_str.split('\n'):
        if line.startswith('  - '):
            if current_key:
                if current_key not in list_items:
                    list_items[current_key] = []
                list_items[current_key].append(line.strip()[2:])
        else:
            m = re.match(r'^([a-z_]+):', line)
            if m:
                current_key = m.group(1)
                val = line.split(':', 1)[1].strip()
                if val == '[]':
                    list_items[current_key] = []
            else:
                current_key = None
    return list_items, content, match

def write_file(path, list_items, content, match):
    fm_lines = match.group(1).split('\n')
    new_fm = []
    skip_mode = False
    
    keys_written = set()
    
    for line in fm_lines:
        m = re.match(r'^([a-z_]+):', line)
        if m:
            key = m.group(1)
            if key in list_items:
                skip_mode = True
                keys_written.add(key)
                items = list_items[key]
                if len(items) == 0:
                    new_fm.append(f"{key}: []")
                else:
                    new_fm.append(f"{key}:")
                    for item in items:
                        new_fm.append(f"  - {item}")
            else:
                skip_mode = False
                new_fm.append(line)
        elif skip_mode:
            continue
        else:
            new_fm.append(line)
            
    # Write any keys that weren't in the original frontmatter
    for k, items in list_items.items():
        if k not in keys_written and k in ["depends_on", "extends", "used_by", "contrasts_with", "implemented_by", "defines", "evidence"]:
            if len(items) == 0:
                new_fm.append(f"{k}: []")
            else:
                new_fm.append(f"{k}:")
                for item in items:
                    new_fm.append(f"  - {item}")
                    
    new_fm_str = '\n'.join(new_fm)
    new_content = content[:match.start(1)] + new_fm_str + content[match.end(1):]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    subprocess.run('python scripts/okf_lint.py > final_lint.txt', shell=True)
    with open('final_lint.txt', 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    missing_links = []
    for line in lines:
        if '(link-in-graph)' in line:
            m = re.search(r'\[WARNING\] (.*?): Inline link to \'(.*?)\'', line)
            if m:
                missing_links.append((m.group(1), m.group(2)))
                
    if missing_links:
        for src, dst in missing_links:
            src_path = os.path.join('okf', src)
            print(f"Missing: injecting {src} -> {dst} as used_by")
            list_items, content, match = parse_file(src_path)
            if 'used_by' not in list_items:
                list_items['used_by'] = []
            if dst not in list_items['used_by']:
                list_items['used_by'].append(dst)
            write_file(src_path, list_items, content, match)
            
    print("Done checking missing links.")

if __name__ == '__main__':
    main()
