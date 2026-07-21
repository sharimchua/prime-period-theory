import json

def chunk_list(lst, n):
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

with open('missing_links.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Deduplicate to avoid asking subagents to infer the exact same source->target pair multiple times
unique_links = {}
for item in data:
    key = f"{item['source']}::{item['target']}"
    if key not in unique_links:
        unique_links[key] = item

data = list(unique_links.values())

chunks = list(chunk_list(data, 75))

for i, chunk in enumerate(chunks):
    with open(f'chunk_{i}.json', 'w', encoding='utf-8') as f:
        json.dump(chunk, f, indent=2)
    print(f"Wrote {len(chunk)} items to chunk_{i}.json")
