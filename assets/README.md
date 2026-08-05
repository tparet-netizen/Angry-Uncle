# Photo assets

Drop a photo in this folder named exactly:

```
angry-uncle.jpg
```

(`.jpeg`, `.png`, and `.webp` also work — the game checks for all four, in that order.)

That photo will be used for the angry uncle's box instead of the emoji. If no
file is found, the game falls back to the 😡 emoji automatically — nothing
breaks either way.

A square-ish, closely-cropped photo of his face works best since it fills a
square box (`object-fit: cover`).
