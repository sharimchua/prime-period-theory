const fs = require('fs');

function replaceLink(filePath, linkPath, newPath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const regex = new RegExp(`\\[([^\\]]+)\\]\\(${linkPath.replace(/\./g, '\\.')}\\)`, 'g');
    if (newPath) {
        content = content.replace(regex, `[$1](${newPath})`);
    } else {
        content = content.replace(regex, `$1`);
    }
    fs.writeFileSync(filePath, content, 'utf-8');
}

replaceLink('okf/applications/component-philosophy.md', '../reference/emergent-analysis.md', null);
replaceLink('okf/applications/component-philosophy.md', 'visualisation.md', null);
replaceLink('okf/applications/play-along.md', '../pedagogy/progressive-complexity.md', null);
replaceLink('okf/applications/play-along.md', 'transcription.md', null);
replaceLink('okf/extended/path-equivalence.md', 'prime-lattice.md', '../foundations/prime-lattice.md');
replaceLink('okf/extended/path-equivalence.md', 'prime-families.md', '../foundations/prime-families.md');
replaceLink('okf/foundations/prime-lattice.md', 'anchors-and-prime-lattice-coordinates.md', 'anchors.md');
replaceLink('okf/implementations/index.md', '../applications/index.md', '../applications/index.md');
replaceLink('okf/implementations/index.md', 'harmonic-geometry.md', null);
replaceLink('okf/implementations/ppt-components.md', '../applications/visualisation.md', null);
replaceLink('okf/index.md', 'pedagogy/learning-paths.md', null);
replaceLink('okf/index.md', 'pedagogy/progressive-complexity.md', null);
replaceLink('okf/index.md', 'applications/index.md', 'applications/index.md');
replaceLink('okf/index.md', 'applications/visualisation.md', null);
replaceLink('okf/index.md', 'applications/transcription.md', null);
replaceLink('okf/index.md', 'implementations/harmonic-geometry.md', null);
replaceLink('okf/index.md', 'implementations/note-navigation.md', null);
replaceLink('okf/index.md', 'implementations/frequency-perception.md', null);
replaceLink('okf/pedagogy/cross-domain-transfer.md', '../domains/form.md', null);
replaceLink('okf/pedagogy/ear-first.md', '../applications/transcription.md', null);
replaceLink('okf/pedagogy/index.md', 'learning-paths.md', null);
replaceLink('okf/pedagogy/index.md', 'progressive-complexity.md', null);
replaceLink('okf/pedagogy/index.md', '../applications/index.md', '../applications/index.md');
replaceLink('okf/specifications/prime-lattice-boundary-routing.md', '../implementations/note-navigation.md', null);
replaceLink('okf/structure/musicoil.md', '../domains/form.md', null);
replaceLink('okf/structure/musicoil.md', 'spatial-harmony.md', null);
replaceLink('okf/structure/musicoil.md', '../reference/emergent-analysis.md', null);

replaceLink('docs/src/content/generated_topics/patterns-in-time.mdx', '../okf/index', '../../../../okf/index.md');
