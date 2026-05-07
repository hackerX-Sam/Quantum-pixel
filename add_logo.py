import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the divs that contain "Quantum Pixel" that we added previously
# They look like: <div id="..." style="...">Quantum Pixel</div>
# Except for id="ixe4zkj" which is the preloader image.
# We will just find all <div id="[id]" style="[style]">Quantum Pixel</div>

def replace_with_image(match):
    tag = match.group(0)
    # Extract ID
    id_match = re.search(r'id="([^"]+)"', tag)
    if not id_match:
        return tag
    element_id = id_match.group(1)
    
    # Extract Style
    style_match = re.search(r'style="([^"]+)"', tag)
    style = style_match.group(1) if style_match else ""
    
    # We want to add display: flex; align-items: center; gap: 8px; to the style if not present
    if "display: flex" not in style:
        style += " display: flex; align-items: center; gap: 8px;"
        
    img_tag = '<img src="https://ik.imagekit.io/logicsync/company%20logo.png?updatedAt=1776027301470" alt="Logo" style="height: 1.2em; width: auto; object-fit: contain;" />'
    
    return f'<div id="{element_id}" style="{style}">{img_tag}Quantum Pixel</div>'

new_content = re.sub(r'<div[^>]*id="[^"]+"[^>]*style="[^"]*"[^>]*>\s*Quantum Pixel\s*</div>', replace_with_image, content, flags=re.IGNORECASE)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Logo added next to text successfully.")
