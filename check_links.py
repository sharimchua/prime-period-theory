import os
import re

def get_markdown_files(directory):
    md_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md') or file.endswith('.mdx'):
                md_files.append(os.path.join(root, file))
    return md_files

def check_links():
    docs_md = get_markdown_files('docs/src/')
    okf_md = get_markdown_files('okf/')
    all_files = docs_md + okf_md

    link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')

    for file_path in all_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        matches = link_pattern.findall(content)
        for text, href in matches:
            if href.startswith('http') or href.startswith('mailto:') or href.startswith('#'):
                continue

            href_clean = href.split('#')[0].split('?')[0]
            if not href_clean:
                continue

            # If absolute path like /reference/... we can check against our routes, but let's just flag them
            # if relative path, check if it exists

            if href_clean.startswith('/'):
                print(f"File {file_path} has absolute link {href_clean}")
                continue

            base_dir = os.path.dirname(file_path)
            target_path = os.path.normpath(os.path.join(base_dir, href_clean))
            if not os.path.exists(target_path):
                print(f"BROKEN RELATIVE LINK in {file_path}: {href} -> {target_path} not found")

check_links()
