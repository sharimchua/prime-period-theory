import re

with open('docs/src/content/generated_topics/patterns-in-time.mdx', 'r') as f:
    content = f.read()

content = content.replace('](/reference)', '](/reference/)')

with open('docs/src/content/generated_topics/patterns-in-time.mdx', 'w') as f:
    f.write(content)
