"""
Build the photographs the motif layer shows inside the mark (components/motif/MotifLayer.tsx).

Each piece gets one image: the sharp photograph, sized smaller than the piece so the camera sees
more of the room, feathered into a blurred mirror of itself that fills the rest of the piece plus
an overscan margin for the drift loop and scroll parallax. Everything is laid out in the turned
frame the camera sees (glyph units, see PHOTOS in MotifLayer.tsx); the printed canvas rects are
what MotifLayer needs.

    pip install pillow numpy && python3 scripts/motif-photos.py
"""
import numpy as np
from PIL import Image, ImageFilter

SRC = "public/images"
# piece bounding boxes in the turned frame: x0, y0, x1, y1
BBOX = {"B": (407.5, 479.1, 741.5, 741.1), "C": (-53, 85.5, 308, 321.3), "D": (-79.5, 357.5, 357, 741.1)}
# photograph, the rect it filled the piece at, and the middle of what the camera sees at its hold
PIECE = {
    "C": ("private-dinner", (-82, 85.5, 390, 236), (45.5, 167)),
    "D": ("executive-breakfast", (-103, 357.5, 460, 384), (169, 596)),
    "B": ("roundtable", (407.5, 479, 334, 278), (575, 653)),
}
OUT = {"C": "motif-dinner", "D": "motif-breakfast", "B": "motif-roundtable"}
# the sharp photo at this share of the size it used to fill the piece at: the breakfast's hold sees
# the lower half of its piece, so it steps back further to bring the table's faces in
ZOOM_OUT = {"C": 0.78, "D": 0.62, "B": 0.78}
MARGIN = 0.06  # overscan round the piece, as a share of its box
FEATHER = 0.07  # soft edge of the sharp photo, as a share of its shorter side

for k, (name, (x, y, w, h), (fx, fy)) in PIECE.items():
    photo = Image.open(f"{SRC}/{name}.webp").convert("RGB")
    # zoom out about the hold's focus
    z = ZOOM_OUT[k]
    w2, h2 = w * z, h * z
    x2, y2 = fx + (x - fx) * z, fy + (y - fy) * z
    bx0, by0, bx1, by1 = BBOX[k]
    mx, my = (bx1 - bx0) * MARGIN, (by1 - by0) * MARGIN
    cx0, cy0, cx1, cy1 = min(bx0 - mx, x2), min(by0 - my, y2), max(bx1 + mx, x2 + w2), max(by1 + my, y2 + h2)
    d = photo.width / w2  # px per glyph unit, the photograph's own density
    W, H = round((cx1 - cx0) * d), round((cy1 - cy0) * d)
    ox, oy = round((x2 - cx0) * d), round((y2 - cy0) * d)
    sharp = photo.resize((round(w2 * d), round(h2 * d)), Image.LANCZOS)
    # the ground: the photograph mirrored out to the canvas, heavily blurred and a touch darker
    a = np.asarray(sharp)
    pad = ((oy, max(H - oy - a.shape[0], 0)), (ox, max(W - ox - a.shape[1], 0)), (0, 0))
    ground = np.pad(a, pad, mode="symmetric")[:H, :W]
    ground = Image.fromarray(ground).filter(ImageFilter.GaussianBlur(min(W, H) * 0.035))
    ground = Image.fromarray((np.asarray(ground) * 0.82).astype(np.uint8))
    # the sharp photograph on top, feathered
    f = min(sharp.size) * FEATHER
    yy, xx = np.mgrid[0 : sharp.height, 0 : sharp.width]
    edge = np.minimum.reduce([xx, yy, sharp.width - 1 - xx, sharp.height - 1 - yy]).astype(float)
    alpha = np.clip(edge / f, 0, 1)
    alpha = alpha * alpha * (3 - 2 * alpha)
    ground.paste(sharp, (ox, oy), Image.fromarray((alpha * 255).astype(np.uint8)))
    ground.save(f"{SRC}/{OUT[k]}.webp", "WEBP", quality=78, method=6)
    print(f'{k}: {OUT[k]}.webp {W}x{H}  x: {cx0:.1f}, y: {cy0:.1f}, w: {cx1 - cx0:.1f}, h: {cy1 - cy0:.1f}')
