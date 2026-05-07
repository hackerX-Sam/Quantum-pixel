import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_logo(match):
    tag = match.group(0)
    # Extract ID
    id_match = re.search(r'id="([^"]+)"', tag)
    if not id_match:
        return tag
    element_id = id_match.group(1)
    
    # Determine color
    if 'dark' in tag.lower():
        color = '#000'
    else:
        color = '#fff'
        
    return f'<div id="{element_id}" style="font-size: 24px; font-weight: 800; font-family: sans-serif; white-space: nowrap; color: {color}; letter-spacing: -0.5px;">Quantum Pixel</div>'

new_content = re.sub(r'<img[^>]*logo[^>]*>', replace_logo, content, flags=re.IGNORECASE)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Replaced logos successfully.")
