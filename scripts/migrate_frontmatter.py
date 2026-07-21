import os

okf_dir = 'okf'

new_fields_template = """status: stable
domain: {domain}
depends_on: []
extends: []
contrasts_with: []
used_by: []
implemented_by: []
defines: []
evidence: []
"""

migrated = 0
for root, _, files in os.walk(okf_dir):
    for file in files:
        if file.endswith('.md'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if not content.startswith('---'):
                continue
                
            parts = content.split('---', 2)
            if len(parts) < 3:
                continue
                
            fm = parts[1]
            if '\nstatus: ' in fm and '\ndomain: ' in fm:
                continue
                
            # determine domain
            rel_path = os.path.relpath(root, okf_dir)
            domain = rel_path.replace('\\', '/') if rel_path != '.' else 'root'
            
            new_fm = fm.rstrip() + '\n\n# Typed relationships\n' + new_fields_template.format(domain=domain)
            new_content = f"---{new_fm}---\n{parts[2].lstrip()}"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
            migrated += 1

print(f"Migrated {migrated} files.")
