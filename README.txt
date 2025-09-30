
D&D Skill Trees – CSS Lines v24
-------------------------------
Why you still might not see them:
- The previous CSS version had the line container at `width: 0`, which could make percentage-based node positioning degenerate on some devices. Also, filter-based glow can be inconsistent.

Fixes:
- The line container now has a **real width (6px)** so the line and nodes always have a measurable box.
- Glow uses **layered box-shadows** (no CSS filters), which are dependable across browsers.
- Kept: 12 slides (4 headings × 3), heading changes every 3, infinite belt with clones, smooth pixel parallax.

If you still don't see the lines, we can temporarily tint them (e.g., cyan) to confirm layering, then dial it back.
