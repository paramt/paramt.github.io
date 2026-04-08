# Thumbnail Compression

When adding a new image to the site (hero or timeline), generate a compressed WebP thumbnail alongside it. Run from `src/data/images/`:

```bash
ffmpeg -y -i "input.jpg" -vf "scale='min(800,iw)':-1" "/tmp/thumb_tmp.png" 2>/dev/null && \
cwebp -q 50 -quiet "/tmp/thumb_tmp.png" -o "input.thumb.webp" && \
rm /tmp/thumb_tmp.png
```

Two steps (not ffmpeg alone) because ffmpeg preserves ICC color profiles in JPEG output, bloating the file. The PNG intermediate + cwebp strips it.

Target: ~5–10% of original. Verify: `echo "scale=1; $(stat -f%z input.thumb.webp) * 100 / $(stat -f%z input.jpg)" | bc`

Naming: `{original-name}.thumb.webp` in the same directory.

Wire up:
- Hero: import in `src/data/heroPolaroids.js`, add `thumb` field to entry
- Timeline: import in `src/data/timeline.js`, wrap with `img(src, thumb)` helper
