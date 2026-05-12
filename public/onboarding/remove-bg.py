#!/usr/bin/env python3
"""
Remove the cream background from Fylos onboarding illustrations.
Uses flood-fill from corners to make the cream area transparent.
Subject (coral pet illustration) stays intact.

Usage:  python3 remove-bg.py input.jpg output.png
"""
import sys
from collections import deque
from PIL import Image


def color_distance(c1, c2):
    """Simple sum-of-abs-differences distance between two RGB colors."""
    return abs(c1[0] - c2[0]) + abs(c1[1] - c2[1]) + abs(c1[2] - c2[2])


def remove_background(input_path, output_path, tolerance=42, feather=14):
    """Flood-fill from corners. Anything within `tolerance` of the bg color
    chain becomes transparent. `feather` widens the alpha falloff for soft edges.
    """
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    pixels = img.load()

    # Sample bg color from the four corners and average
    corner_samples = [
        pixels[0, 0],
        pixels[w - 1, 0],
        pixels[0, h - 1],
        pixels[w - 1, h - 1],
    ]
    bg = tuple(sum(c[i] for c in corner_samples) // 4 for i in range(3))
    print(f"Detected bg color: rgb{bg}")

    # Flood fill from each corner. Visited grid marks alpha.
    # 0 = not visited, opaque. 1 = bg (transparent).
    alpha = [[255] * w for _ in range(h)]
    queue = deque()
    for sx, sy in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        queue.append((sx, sy))

    while queue:
        x, y = queue.popleft()
        if not (0 <= x < w and 0 <= y < h):
            continue
        if alpha[y][x] == 0:  # already transparent
            continue
        r, g, b, _ = pixels[x, y]
        dist = color_distance((r, g, b), bg)
        if dist <= tolerance:
            alpha[y][x] = 0  # mark transparent
            queue.append((x + 1, y))
            queue.append((x - 1, y))
            queue.append((x, y + 1))
            queue.append((x, y - 1))
        elif dist <= tolerance + feather:
            # Feather edge — partial alpha
            frac = (dist - tolerance) / feather
            alpha[y][x] = int(255 * frac)

    # Apply alpha
    for y in range(h):
        for x in range(w):
            r, g, b, _ = pixels[x, y]
            pixels[x, y] = (r, g, b, alpha[y][x])

    img.save(output_path, "PNG")
    print(f"Saved transparent PNG: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 remove-bg.py input.jpg output.png [tolerance] [feather]")
        sys.exit(1)
    inp = sys.argv[1]
    out = sys.argv[2]
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 42
    fea = int(sys.argv[4]) if len(sys.argv) > 4 else 14
    remove_background(inp, out, tol, fea)
