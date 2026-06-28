import os
import re
import sys

AMERICAN_TO_AUSTRALIAN = {
    "analyze": "analyse",
    "color": "colour",
    "behavior": "behaviour",
    "flavor": "flavour",
    "humor": "humour",
    "labor": "labour",
    "neighbor": "neighbour",
    "odor": "odour",
    "center": "centre",
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
    "modeling": "modelling",
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
    for i, line in enumerate(lines):
        for us_word, au_word in AMERICAN_TO_AUSTRALIAN.items():
            pattern = r'\b' + us_word + r'\b'
            if re.search(pattern, line, re.IGNORECASE):
                errors.append(f"Line {i+1}: Found American spelling '{us_word}'. Use '{au_word}' instead.")
                
            pattern_s = r'\b' + us_word + r's\b'
            if re.search(pattern_s, line, re.IGNORECASE):
                errors.append(f"Line {i+1}: Found American spelling '{us_word}s'. Use '{au_word}s' instead.")
                
            if us_word.endswith('e'):
                pattern_ed = r'\b' + us_word + r'd\b'
                pattern_ing = r'\b' + us_word[:-1] + r'ing\b'
                if re.search(pattern_ed, line, re.IGNORECASE):
                    errors.append(f"Line {i+1}: Found American spelling '{us_word}d'. Use '{au_word}d' instead.")
                if re.search(pattern_ing, line, re.IGNORECASE):
                    errors.append(f"Line {i+1}: Found American spelling '{us_word[:-1]}ing'. Use '{au_word[:-1]}ing' instead.")
                    
    return errors

def main():
    has_errors = False
    directories_to_check = ["okf", "docs"]
    
    for directory in directories_to_check:
        if not os.path.exists(directory):
            continue
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(".md") or file.endswith(".astro"):
                    filepath = os.path.join(root, file)
                    errors = check_file(filepath)
                    if errors:
                        has_errors = True
                        print(f"❌ {filepath}:")
                        for err in errors:
                            print(f"   {err}")
                            
    if has_errors:
        print("\nAustralian English validation failed. Please fix the spellings above.")
        sys.exit(1)
    else:
        print("✅ All checked files passed Australian English validation.")

if __name__ == "__main__":
    main()
