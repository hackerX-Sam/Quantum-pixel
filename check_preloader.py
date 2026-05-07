import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

matches = re.findall(r'<img[^>]*id="ixe4zkj"[^>]*>', content, flags=re.IGNORECASE)
print('\n'.join(matches))
