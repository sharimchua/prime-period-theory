with open(".github/workflows/validate-okf.yml", "r") as f:
    content = f.read()

content = content.replace(
    "    if: github.event_name == 'pull_request'",
    "    if: github.event_name == 'pull_request'\n    permissions:\n      contents: read\n      pull-requests: write"
)

with open(".github/workflows/validate-okf.yml", "w") as f:
    f.write(content)
