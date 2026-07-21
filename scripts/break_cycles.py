import os
import re

def parse_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not match: return None, content, None
    fm_str = match.group(1)
    
    depends = []
    lines = fm_str.split('\n')
    in_depends = False
    for line in lines:
        if line.startswith('depends_on:'):
            in_depends = True
        elif in_depends and line.startswith('  - '):
            depends.append(line.strip()[2:])
        elif in_depends and re.match(r'^[a-z_]+:', line):
            in_depends = False
            
    return depends, content, match

def break_cycles():
    import subprocess
    max_iter = 100
    
    for _ in range(max_iter):
        print(f"Iteration {_}")
        subprocess.run('python scripts/okf_lint.py > temp_lint.txt', shell=True)
        with open('temp_lint.txt', 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        cycle = None
        for line in lines:
            if '(depends-acyclic)' in line:
                # [FAIL] [ERROR] ...: Dependency cycle detected: A -> B -> C -> A
                match = re.search(r'Dependency cycle detected: (.*?) \(depends-acyclic\)', line)
                if match:
                    cycle = match.group(1).split(' -> ')
                    break
                    
        if not cycle:
            print("No more cycles detected.")
            break
            
        # Break the cycle by changing the first edge from depends_on to used_by
        src = cycle[-2] # e.g. C
        dst = cycle[-1] # e.g. A
        
        print(f"Breaking cycle: converting {src} -> {dst} to used_by")
        
        src_path = os.path.join('okf', src)
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # We need to remove dst from depends_on, and add it to used_by
        # For simplicity, let's just use string replacement if we know it's there
        depends, _, _ = parse_file(src_path)
        
        # Rewrite the file
        lines = content.split('\n')
        new_lines = []
        in_depends = False
        in_used_by = False
        added_to_used = False
        
        for line in lines:
            if line.startswith('depends_on:'):
                in_depends = True
                new_lines.append(line)
            elif line.startswith('used_by:'):
                in_used_by = True
                in_depends = False
                new_lines.append(line)
            elif in_depends and line.strip() == f"- {dst}":
                continue # remove it
            elif in_depends and re.match(r'^[a-z_]+:', line):
                in_depends = False
                new_lines.append(line)
            else:
                new_lines.append(line)
                
        content = '\n'.join(new_lines)
        
        # Add to used_by
        if 'used_by:' in content:
            # simple inject
            content = content.replace('used_by:\n', f'used_by:\n  - {dst}\n')
        else:
            # inject before end of frontmatter
            content = content.replace('\n---\n', f'\nused_by:\n  - {dst}\n---\n', 1)
            
        with open(src_path, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == '__main__':
    break_cycles()
