import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

new_tag = '<img id="ixe4zkj" src="https://ik.imagekit.io/logicsync/company%20logo.png?updatedAt=1776027301470" alt="Company Logo" loading="eager" style="filter: brightness(0) invert(1);" />'

new_content = re.sub(r'<img[^>]*id="ixe4zkj"[^>]*>', new_tag, content, flags=re.IGNORECASE)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Preloader logo made white.")
