#!/usr/bin/env python3
import os
import re
import yaml
import sys
from pathlib import Path

# Optional: Import openai for generation if available
try:
    import openai
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

def get_mtime(path):
    return os.path.getmtime(path) if os.path.exists(path) else 0

def generate_content(instructions, deps_content):
    if not HAS_OPENAI:
        print("  WARNING: openai package not installed. Skipping generation to prevent overwriting valid files.")
        return None

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("  WARNING: OPENAI_API_KEY environment variable not set. Skipping generation to prevent overwriting valid files.")
        return None

    try:
        client = openai.OpenAI(api_key=api_key)
        prompt = f"Instructions:\n{instructions}\n\nContext Dependencies:\n{deps_content}\n\nPlease generate the markdown content."
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant generating technical markdown content."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"  WARNING: OpenAI API generation failed: {e}")
        return None

def process_template(template_path):
    print(f"Checking template: {template_path}")
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match the agent generate block (either HTML or MDX comment)
    block_pattern = re.compile(r'(<!--|\{/\*)\s*AGENT_GENERATE_BLOCK(.*?)(-->|\*/\})', re.DOTALL)
    match = block_pattern.search(content)

    if not match:
        print("  No AGENT_GENERATE_BLOCK found.")
        return

    yaml_content = match.group(2)
    try:
        config = yaml.safe_load(yaml_content)
    except yaml.YAMLError as e:
        print(f"  Error parsing YAML in block: {e}")
        return

    deps = config.get('okf_dependencies', [])
    instructions = config.get('instructions', '')

    if 'docs/templates/topics/' in template_path:
        generated_path = template_path.replace('docs/templates/topics/', 'docs/src/content/generated_topics/')
    else:
        base_name = os.path.basename(template_path)
        generated_path = os.path.join('docs/src/content/generated_topics', base_name)

    generated_mtime = get_mtime(generated_path)

    needs_update = False
    if not os.path.exists(generated_path):
        needs_update = True
        print(f"  Needs generation: {generated_path} does not exist.")
    else:
        for dep in deps:
            if get_mtime(dep) > generated_mtime:
                needs_update = True
                print(f"  Needs update: dependency {dep} is newer than generated file.")
                break

    if not needs_update:
        print("  Up to date.")
        return

    print(f"  Regenerating {generated_path}...")

    deps_content = ""
    for dep in deps:
        if os.path.exists(dep):
            with open(dep, 'r', encoding='utf-8') as df:
                deps_content += f"\n--- {dep} ---\n" + df.read() + "\n"
        else:
            print(f"  Warning: Dependency {dep} not found.")

    new_generated_content = generate_content(instructions, deps_content)

    # If generation was skipped or failed, do not write the file
    if new_generated_content is None:
        print("  Generation aborted.")
        return

    end_pattern = re.compile(r'(<!--|\{/\*)\s*AGENT_GENERATE_BLOCK_END\s*(-->|\*/\})')
    end_match = end_pattern.search(content, match.end())

    is_mdx = generated_path.endswith('.mdx')

    # Convert original block comment to correct comment type for MDX
    start_tag = "{/* AGENT_GENERATE_BLOCK" if is_mdx else "<!-- AGENT_GENERATE_BLOCK"
    end_tag = "*/}" if is_mdx else "-->"
    end_block_tag = "{/* AGENT_GENERATE_BLOCK_END */}" if is_mdx else "<!-- AGENT_GENERATE_BLOCK_END -->"

    new_block = f"{start_tag}{yaml_content}{end_tag}"

    if end_match:
        final_content = content[:match.start()] + new_block + f"\n\n{new_generated_content}\n\n" + end_block_tag + content[end_match.end():]
    else:
        final_content = content[:match.start()] + new_block + f"\n\n{new_generated_content}\n\n" + end_block_tag + "\n" + content[match.end():]

    os.makedirs(os.path.dirname(generated_path), exist_ok=True)
    with open(generated_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
    print(f"  Saved {generated_path}")

def main():
    templates_dir = 'docs/templates'
    if not os.path.exists(templates_dir):
        print(f"Directory {templates_dir} not found.")
        sys.exit(1)

    for root, _, files in os.walk(templates_dir):
        for file in files:
            if file.endswith('.mdx') or file.endswith('.md'):
                process_template(os.path.join(root, file))

if __name__ == "__main__":
    main()
