import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I added the image with style="height: 1.2em; width: auto; object-fit: contain;"
# I will replace "height: 1.2em;" with "height: 1.6em;"
# The regex will target exactly the images I added earlier.

new_content = content.replace('height: 1.2em; width: auto; object-fit: contain;', 'height: 1.8em; width: auto; object-fit: contain;')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Logo resized successfully.")
