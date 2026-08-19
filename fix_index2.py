with open('docs/src/pages/topics/index.mdx', 'r') as f:
    content = f.read()

content = content.replace('/reference/uniform-solfege/index/', '/reference/uniform-solfege/')
content = content.replace('/reference/ppd/index/', '/reference/ppd/')

with open('docs/src/pages/topics/index.mdx', 'w') as f:
    f.write(content)
