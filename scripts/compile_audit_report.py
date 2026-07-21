import json
import os

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

# Load contexts to include in the report
with open('missing_links.json', 'r', encoding='utf-8') as f:
    missing_links = json.load(f)
    
context_map = {}
for item in missing_links:
    key = f"{item['source']}::{item['target']}"
    context_map[key] = item['context']

# Group by source file
grouped = {}
for res in results:
    source = res.get('source', '')
    target = res.get('target', '')
    relation = res.get('relation', 'depends_on')
    
    if source not in grouped:
        grouped[source] = []
        
    key = f"{source}::{target}"
    context = context_map.get(key, "Context not found.")
    
    grouped[source].append({
        'target': target,
        'relation': relation,
        'context': context
    })

artifact_path = r'C:\Users\shari\.gemini\antigravity\brain\cbc8e5dd-b235-4e0b-868b-c2cac47bbfbc\link_audit_report.md'

with open(artifact_path, 'w', encoding='utf-8') as f:
    f.write("# OKF Link Relationship Audit Report\n\n")
    f.write("> [!NOTE]\n")
    f.write("> The subagents have analyzed the context of all missing inline links and inferred the most appropriate typed relationship for the Knowledge Graph. Please review the classifications below. If you'd like to change any of them, just let me know (e.g. \"Change all 'evidence' to 'depends_on' in rhythm.md\"), and then approve the report so I can inject them into the OKF files.\n\n")
    
    for source in sorted(grouped.keys()):
        f.write(f"## {source}\n\n")
        
        # Sort targets
        items = sorted(grouped[source], key=lambda x: x['target'])
        
        for item in items:
            target = item['target']
            relation = item['relation']
            context = item['context']
            
            # Escape newlines in context for blockquote
            context_quoted = "\n> ".join(context.split('\n'))
            
            f.write(f"### Link: `{target}`\n")
            f.write(f"- **Inferred Relation**: **`{relation}`**\n")
            f.write(f"- **Context**:\n> {context_quoted}\n\n")
            
print(f"Generated Audit Report with {len(results)} links.")
