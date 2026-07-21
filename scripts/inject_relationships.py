import json
import os
import re

# Load all results
results = []
for i in range(4):
    filename = f'results_{i}.json'
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
                results.extend(data)
            except Exception as e:
                print(f"Error loading {filename}: {e}")

# Group by source file
injections = {}
for res in results:
    source = res.get('source', '')
    target = res.get('target', '')
    relation = res.get('relation', 'depends_on')
    
    # Validation: sometimes LLMs might hallucinate relation types
    valid_relations = ["depends_on", "extends", "contrasts_with", "used_by", "implemented_by", "defines", "evidence"]
    if relation not in valid_relations:
        relation = "depends_on"
        
    if source not in injections:
        injections[source] = {}
        
    if relation not in injections[source]:
        injections[source][relation] = set()
        
    injections[source][relation].add(target)

okf_dir = 'okf'

files_modified = 0

for source_rel, rel_map in injections.items():
    filepath = os.path.join(okf_dir, source_rel)
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Extract frontmatter
    match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not match:
        print(f"No frontmatter found in {filepath}")
        continue
        
    fm_str = match.group(1)
    fm_lines = fm_str.split('\n')
    
    new_fm_lines = []
    
    # We parse the yaml line by line to inject items
    # Example format:
    # depends_on: []
    # or
    # depends_on:
    #   - something
    
    current_key = None
    list_items = {} # key -> list of items
    
    # First pass: parse existing items
    for line in fm_lines:
        if line.startswith(' ' * 2 + '- '):
            if current_key:
                val = line.strip()[2:]
                if current_key not in list_items:
                    list_items[current_key] = []
                list_items[current_key].append(val)
        else:
            key_match = re.match(r'^([a-z_]+):', line)
            if key_match:
                current_key = key_match.group(1)
                val = line.split(':', 1)[1].strip()
                if val == '[]':
                    list_items[current_key] = []
                elif current_key == 'tags' and val.startswith('['):
                     pass
            else:
                current_key = None
                
    # Merge new items
    for rel_key, targets in rel_map.items():
        if rel_key not in list_items:
            list_items[rel_key] = []
        for t in targets:
            # Avoid duplicates
            if t not in list_items[rel_key]:
                list_items[rel_key].append(t)
                
    # Second pass: rebuild frontmatter
    new_fm = []
    skip_mode = False
    
    for line in fm_lines:
        key_match = re.match(r'^([a-z_]+):', line)
        if key_match:
            key = key_match.group(1)
            if key in rel_map or key in valid_relations: # Rebuild all valid relationship arrays
                skip_mode = True
                
                items = list_items.get(key, [])
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
            
    # Replace in content
    new_fm_str = '\n'.join(new_fm)
    new_content = content[:match.start(1)] + new_fm_str + content[match.end(1):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    files_modified += 1

print(f"Successfully injected inferred relationships into {files_modified} files.")
