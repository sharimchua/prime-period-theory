import os

def remove_broken(path, terms):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    for line in lines:
        if not any(term in line for term in terms):
            new_lines.append(line)
            
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

terms_index = ['implementations/harmonic-geometry.md', 'implementations/note-navigation.md', 'implementations/frequency-perception.md']
remove_broken('okf/index.md', terms_index)

terms_impl = ['harmonic-geometry.md']
remove_broken('okf/implementations/index.md', terms_impl)

terms_ped = ['../domains/form.md']
remove_broken('okf/pedagogy/cross-domain-transfer.md', terms_ped)

terms_musicoil = ['../domains/form.md']
remove_broken('okf/structure/musicoil.md', terms_musicoil)

terms_boundary = ['../implementations/note-navigation.md']
remove_broken('okf/specifications/prime-lattice-boundary-routing.md', terms_boundary)

terms_lattice = ['../extended/prime-lattice-profiles.md']
remove_broken('okf/foundations/prime-lattice.md', terms_lattice)
