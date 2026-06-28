#!/bin/bash
export TZ="Australia/Sydney"
CURRENT_DATE=$(date +%Y-%m-%d)

for file in "$@"; do
    if [[ -f "$file" && "$file" == okf/*.md ]]; then
        # Use sed to replace timestamp line. Handles macOS and Linux sed.
        sed -i.bak -E "s/^timestamp:.*$/timestamp: $CURRENT_DATE/" "$file"
        rm "${file}.bak"
        echo "Updated timestamp in $file to $CURRENT_DATE"
    fi
done
