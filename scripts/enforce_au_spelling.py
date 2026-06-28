import os
import re
import sys

AMERICAN_TO_AUSTRALIAN = {
    "analyze": "analyse",
    "flavor": "flavour",
    "humor": "humour",
    "labor": "labour",
    "neighbor": "neighbour",
    "odor": "odour",
    "meter": "metre",
    "theater": "theatre",
    "defense": "defence",
    "offense": "offence",
    "catalog": "catalogue",
    "dialog": "dialogue",
    "apologize": "apologise",
    "organize": "organise",
    "recognize": "recognise",
    "realize": "realise",
    "customize": "customise",
    "traveling": "travelling",
    "canceled": "cancelled",
    "modeling": "modelling"
}

MD_ONLY_WORDS = {
    "color": "colour",
    "behavior": "behaviour",
    "center": "centre",
    "colorful": "colourful"
}

def check_file(filepath):
    errors = []
    with open(filepath, 'r', encoding='utf-8') as f:
        try:
            content = f.read()
        except UnicodeDecodeError:
            return errors
            
    lines = content.split('\n')
    is_md = filepath.endswith('.md')
    in_code_block = False
    
    for i, line in enumerate(lines):
        # Track markdown code blocks
        if is_md and line.strip().startswith('```'):
            in_code_block = not in_code_block
            continue
            
        # Skip checking inside markdown code blocks entirely
        if in_code_block:
            continue
            
        # Remove inline code `...` before checking so we don't flag `color: red;`
        text_to_check = re.sub(r'`[^`]*`', '', line)
        
        words_to_check = dict(AMERICAN_TO_AUSTRALIAN)
        if is_md:
            words_to_check.update(MD_ONLY_WORDS)

        for us_word, au_word in words_to_check.items():
            pattern = r'\b' + us_word + r'\b'
            if re.search(pattern, text_to_check, re.IGNORECASE):
                errors.append(f"Line {i+1}: Found American spelling '{us_word}'. Use '{au_word}' instead.")
                
            pattern_s = r'\b' + us_word + r's\b'
            if re.search(pattern_s, text_to_check, re.IGNORECASE):
                errors.append(f"Line {i+1}: Found American spelling '{us_word}s'. Use '{au_word}s' instead.")
                
            if us_word.endswith('e'):
                pattern_ed = r'\b' + us_word + r'd\b'
                pattern_ing = r'\b' + us_word[:-1] + r'ing\b'
                if re.search(pattern_ed, text_to_check, re.IGNORECASE):
                    errors.append(f"Line {i+1}: Found American spelling '{us_word}d'. Use '{au_word}d' instead.")
                if re.search(pattern_ing, text_to_check, re.IGNORECASE):
                    errors.append(f"Line {i+1}: Found American spelling '{us_word[:-1]}ing'. Use '{au_word[:-1]}ing' instead.")
                    
    return errors

def main():
    has_errors = False
    directories_to_check = ["okf", "docs"]
    
    for directory in directories_to_check:
        if not os.path.exists(directory):
            continue
        for root, dirs, files in os.walk(directory):
            if 'node_modules' in dirs:
                dirs.remove('node_modules')
            for file in files:
                if file.endswith(".md") or file.endswith(".astro"):
                    filepath = os.path.join(root, file)
                    errors = check_file(filepath)
                    if errors:
                        has_errors = True
                        print(f"[X] {filepath}:")
                        for err in errors:
                            print(f"   {err}")
                            
    if has_errors:
        print("\nAustralian English validation failed. Please fix the spellings above.")
        sys.exit(1)
    else:
        print("[OK] All checked files passed Australian English validation.")

if __name__ == "__main__":
    main()
