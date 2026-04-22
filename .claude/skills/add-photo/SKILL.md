---
name: add-photo
version: 1.0.0
description: |
  Add a new photo (and optional video) to the personal website. Handles compression,
  dimension extraction, and wiring into heroPolaroids.js or timeline.js.
  Use when the user says "add a photo", "add an image", "add this pic", "upload photo",
  "upload image", "upload this pic", etc.
allowed-tools:
  - Bash
  - Read
  - Edit
---

# /add-photo — Add a New Photo

You are adding a photo to Param's personal website. Follow these steps in order.

## Step 1 — Gather inputs

Ask the user for everything you need before touching any files:

1. **Source file path** — the original image (jpg, png, etc.).
2. **Destination directory** — where to put the compressed file inside `src/data/images/`. Suggest `src/data/images/hero/` for hero photos or ask which timeline event it belongs to.
3. **Target** — is this for the **hero** polaroid carousel or a **timeline** event attachment?
   - If timeline: which event (month + title) does it attach to?
4. **Video file** (optional) — path to a matching `.mp4` if any.
5. **Location label** (optional, e.g. `"Vancouver, BC"`) and **date label** (optional, e.g. `"08/16/24"`).

Do not proceed until you have at least the source path and target.

## Step 2 — Compress the image

Run from the project root. Replace `INPUT` with the source path and `OUTPUT_DIR` with the destination directory inside `src/data/images/`.

```bash
INPUT="<source path>"
BASENAME=$(basename "$INPUT" | sed 's/\.[^.]*$//')
OUTPUT_DIR="src/data/images/<dest subdir>"
mkdir -p "$OUTPUT_DIR"
ffmpeg -y -i "$INPUT" -vf "scale='min(800,iw)':-1" "/tmp/thumb_tmp.png" 2>/dev/null && \
cwebp -q 50 -quiet "/tmp/thumb_tmp.png" -o "$OUTPUT_DIR/$BASENAME.thumb.webp" && \
rm /tmp/thumb_tmp.png
```

Verify the output exists and check compression ratio:
```bash
echo "scale=1; $(stat -f%z "$OUTPUT_DIR/$BASENAME.thumb.webp") * 100 / $(stat -f%z "$INPUT")" | bc
```

Target is ~5–10% of original size. If it's much larger, warn the user.

## Step 3 — Get image dimensions

Read the original file's dimensions (not the thumb — we store the originals for layout):
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$INPUT" 2>/dev/null || \
identify -format "%w %h" "$INPUT" 2>/dev/null
```

Note the `width` (w) and `height` (h).

**Rotation gotcha:** Phone photos often store portrait shots as landscape pixels + an EXIF rotation tag. `ffprobe` returns the raw pixel dimensions (before rotation), so a portrait photo may come back as e.g. `4032 3024` when it visually displays as `3024 4032`. To get the post-rotation (display) dimensions, check the `side_data` rotation or use `exiftool`:
```bash
exiftool -Orientation -ImageWidth -ImageHeight "$INPUT"
```
If `Orientation` is `Rotate 90 CW` or `Rotate 270 CW`, swap w and h before wiring up.

## Step 4 — Compress the video (if provided)

```bash
ffmpeg -y -i "<video path>" \
  -vf "scale='if(gt(iw,ih),640,-2)':'if(gt(iw,ih),-2,640)'" \
  -c:v libx264 -crf 28 -preset fast -an -movflags +faststart \
  "<video path>"
```

This overwrites the video in place, strips audio, scales to max 640px on the longer dimension.

## Step 5 — Wire up

### If target is **hero** (`src/data/heroPolaroids.js`):

1. Add an import at the top with the other thumb imports:
   ```js
   import thumbXxx from './<OUTPUT_DIR relative to src/data/>/<BASENAME>.thumb.webp';
   ```
   If there's a video, add a video import too:
   ```js
   import videoXxx from './<video path relative to src/data/>';
   ```

2. Add a new entry to the `heroPolaroids` array. Put it at the **beginning** (newest first):
   ```js
   { image: thumbXxx, w: <W>, h: <H>, location: '<location>', date: '<date>' },
   ```
   Include `video: videoXxx` if there's a video.

### If target is **timeline** (`src/data/timeline.js`):

1. Add an import at the top with the other thumb imports:
   ```js
   import thumbXxx from './<OUTPUT_DIR relative to src/data/>/<BASENAME>.thumb.webp';
   ```

2. Find the matching event by month + title. Add to its `attachments` array using the `img()` helper:
   ```js
   img(thumbXxx, <W>, <H>)
   ```
   If the event has no `attachments` field yet, add one.

## Step 6 — Confirm

Tell the user:
- The output path of the `.thumb.webp`
- The compression ratio achieved
- Exactly what was changed in which file
