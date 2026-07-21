import os
import re

def add_status():
    okf_dir = 'okf'
    modified = 0
    for root, _, files in os.walk(okf_dir):
        for file in files:
            if file.endswith('.md') and file != 'AGENTS.md':
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
                if match:
                    fm = match.group(1)
                    if 'status:' not in fm:
                        # insert status: stable after timestamp if exists, or at end of fm
                        if 'timestamp:' in fm:
                            new_fm = fm.replace('timestamp:', 'status: stable\ntimestamp:')
                        else:
                            new_fm = fm + '\nstatus: stable'
                        
                        new_content = content[:match.start(1)] + new_fm + content[match.end(1):]
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        modified += 1
                        print(f"Added status to {path}")
    print(f"Modified {modified} files.")

if __name__ == '__main__':
    add_status()
