import re

with open('docs/components/src/tapestry/__tests__/TapestrySerializer.test.ts', 'r') as f:
    content = f.read()

# Add beforeEach and afterEach to the new describe blocks to clean up the globals properly
file_load_mock = "describe('File load branches (mocked)', () => {"
new_file_load_mock = "describe('File load branches (mocked)', () => {\n    afterEach(() => {\n      vi.unstubAllGlobals();\n      vi.restoreAllMocks();\n    });"
content = content.replace(file_load_mock, new_file_load_mock)

file_load_internals = "describe('File load (mocked internals)', () => {"
new_file_load_internals = "describe('File load (mocked internals)', () => {\n    afterEach(() => {\n      vi.unstubAllGlobals();\n      vi.restoreAllMocks();\n    });"
content = content.replace(file_load_internals, new_file_load_internals)

# Fix event handlers
content = content.replace("(inputMock as any).onchange();", "(inputMock as any).onchange({ target: inputMock });")
content = content.replace("if (this.onload) this.onload();", "if (this.onload) this.onload({ target: this });")
content = content.replace("if (this.onerror) this.onerror();", "if (this.onerror) this.onerror({ target: this });")

with open('docs/components/src/tapestry/__tests__/TapestrySerializer.test.ts', 'w') as f:
    f.write(content)
