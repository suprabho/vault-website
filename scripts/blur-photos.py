"""
Build the frosted copies of the photographs the Signals stage shows inside the mark's strokes
(components/sections/Signals.tsx, components/motif/MotifGlyph.tsx): each is blurred, then scaled
down — a blurred picture loses nothing at a third of the size. The mark's counter shows the sharp
original, so the two are drawn at the same place and only the file differs.

    pip install pillow && python3 scripts/blur-photos.py
"""
from PIL import Image, ImageFilter

SRC = "public/images"
# photograph: blur radius in its own pixels (about 11px on screen at the size the stage shows it), downscale
PHOTOS = {
    "intel-regulation": (11, 3),
    "intel-enforcement": (11, 3),
    "intel-financial-crime": (22, 4),
    "private-dinner": (13, 3),
}

for name, (radius, down) in PHOTOS.items():
    im = Image.open(f"{SRC}/{name}.webp").convert("RGB")
    im = im.filter(ImageFilter.GaussianBlur(radius))
    im = im.resize((im.width // down, im.height // down), Image.LANCZOS)
    im.save(f"{SRC}/{name}-blur.webp", "WEBP", quality=80, method=6)
    print(f"{name}-blur.webp", im.size)
