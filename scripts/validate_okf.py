import os
import sys
import yaml
from datetime import datetime

OKF_DIR = "okf"
REQUIRED_KEYS = ["type", "title", "description", "tags", "timestamp"]
ALLOWED_TYPES = ["index", "concept", "reference", "glossary"]

def validate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not content.startswith("---"):
        return f"Missing frontmatter at the start of the file."
    
    try:
        parts = content.split("---", 2)
        if len(parts) < 3:
            return "Malformed frontmatter (missing closing ---)"
        frontmatter = yaml.safe_load(parts[1])
    except yaml.YAMLError as e:
        return f"YAML Parsing Error: {e}"
        
    if not frontmatter:
        return "Frontmatter is empty."
        
    for key in REQUIRED_KEYS:
        if key not in frontmatter:
            return f"Missing required key: '{key}'"
            
    doc_type = frontmatter.get("type")
    if doc_type not in ALLOWED_TYPES:
        return f"Invalid 'type': '{doc_type}'. Must be one of {ALLOWED_TYPES}."
        
    ts = frontmatter.get("timestamp")
    try:
        datetime.strptime(str(ts), "%Y-%m-%d")
    except ValueError:
        return f"Invalid timestamp format: '{ts}'. Must be YYYY-MM-DD."
        
    return None

def main():
    if not os.path.exists(OKF_DIR):
        print(f"Directory '{OKF_DIR}' not found. Skipping validation.")
        return

    has_errors = False
    for root, _, files in os.walk(OKF_DIR):
        for file in files:
            if file.endswith(".md") and not file.endswith("AGENTS.md"):
                filepath = os.path.join(root, file)
                error = validate_file(filepath)
                if error:
                    print(f"❌ {filepath}: {error}")
                    has_errors = True
                else:
                    print(f"✅ {filepath}: Valid")
                    
    if has_errors:
        sys.exit(1)
        
if __name__ == "__main__":
    main()
