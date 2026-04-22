# Polaroid Component

## Props Reference

| Prop | Type | Effect |
|---|---|---|
| `src` | string | Image URL (use the `.thumb.webp` — no full-res needed) |
| `w`, `h` | number | Image dimensions — used for the loading placeholder aspect ratio |
| `video` | string | Video URL — plays on hover after a 400ms delay |
| `rotate` | number | Fixed rotation in degrees; random if omitted |
| `color` | bool | Disables grayscale/sepia filter (default: greyscale) |
| `static` | bool | Disables scale-up on hover |
| `priority` | bool | Sets `fetchPriority="high"` on the `<img>` tag |
| `tack` | bool | Show/hide the pushpin at the top (default: true) |
| `location`, `date` | string | Shown in handwritten font below the image |
| `onClick` | fn | Makes polaroid clickable (cursor changes to pointer) |

## Loading

`<Polaroid>` shows a placeholder icon while `src` loads, then reveals the image. State: `loaded` (boolean). On mount, checks `imgRef.current?.complete` to handle browser-cached images.

**`key` prop on timeline polaroids:** `<Polaroid key={attachment.src} ...>` — using `src` as the key ensures React fully unmounts and remounts when switching timeline entries, resetting `loaded` state.

## HDR Gotcha — sepia filter interaction

iPhone photos with HDR gain maps render in HDR by default when the browser supports it. Applying a `sepia` or `grayscale` filter on top of an HDR image causes severe highlight clipping — whites blow out badly because the filter is applied after tone mapping in HDR headroom. `dynamic-range-limit: standard` on `.polaroid img` and `.polaroid-thumb` clamps images to SDR first, after which filters apply cleanly.
