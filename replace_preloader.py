import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific div with the new image tag.
# We know the div is: <div id="ixe4zkj" ...>Quantum Pixel</div>
# Let's use a regex to match it and replace it.
pattern = re.compile(r'<div[^>]*id="ixe4zkj"[^>]*>Quantum Pixel</div>', re.IGNORECASE)

new_tag = '<img id="ixe4zkj" src="https://ik.imagekit.io/logicsync/company%20logo.png?updatedAt=1776027301470" alt="Company Logo" loading="eager" />'

new_content = pattern.sub(new_tag, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Preloader logo replaced successfully.")
