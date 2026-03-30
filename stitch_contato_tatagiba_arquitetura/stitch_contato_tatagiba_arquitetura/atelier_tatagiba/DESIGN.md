# Design System Strategy: High-End Architectural Editorial

## 1. Overview & Creative North Star
The design system is guided by the Creative North Star: **"The Curated Monolith."** 

This system moves away from the "app-like" feel of rounded buttons and heavy shadows, leaning instead into the world of high-end architectural journals and editorial print. It treats the digital screen as a physical gallery space—minimalist, organized, and deeply sophisticated. We break the standard digital grid through **intentional asymmetry**: large-scale display typography may bleed off the container, and imagery is often layered over subtle tonal shifts rather than contained within boxes. The goal is a feeling of "ordered delicateness" (delicadeza e organização).

---

## 2. Visual Language: Colors & Surfaces

Our palette is rooted in "New Naturalism," utilizing warm off-whites and organic sage greens to evoke a sense of high-end materiality (stone, linen, and weathered concrete).

### Palette Implementation
- **Primary Surface:** `background` (#faf9f8). This is our gallery wall.
- **Secondary/Tertiary Accents:** `primary` (#586155) for authoritative elements and `tertiary` (#74594a) for moments of warmth.
- **Highlight Tones:** Use `primary-fixed-dim` (#ced7c9) for subtle UI backgrounds and `tertiary-fixed-dim` (#ecc8b5) for soft feminine highlights.

### The "No-Line" Rule
To maintain a premium editorial feel, **prohibit the use of 1px solid borders for sectioning.** 
Boundaries must be defined through background color shifts. For example, a content block using `surface-container-low` should sit directly on a `surface` background. The eye should perceive the change in depth through the shift in warmth, not a structural stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine paper sheets.
- **Level 0 (Base):** `surface`
- **Level 1 (Cards/Sections):** `surface-container-low`
- **Level 2 (In-set Details):** `surface-container-high`

### Glass & Gradient Rule
To provide "visual soul," use **Glassmorphism** for navigation bars or floating action panels. Apply a semi-transparent `surface` color with a `20px` backdrop-blur. Main CTAs should avoid flat fills; instead, use a subtle linear gradient from `primary` (#586155) to `primary-dim` (#4c554a) to give the button a "weighted" feel.

---

## 3. Typography: The Editorial Voice

We utilize a high-contrast scale to convey architectural authority.

- **Display & Headlines (Manrope):** These are our "structural beams." Use `display-lg` for hero statements. The semi-bold weight provides the necessary "strength" against the light body text.
- **Body & Captions (Work Sans/DM Sans):** Our "filling materials." 
    - **Rule:** Body text must never fall below 14px. 
    - **Letter-spacing:** For all uppercase labels or titles, apply a tracking of `0.15em` to `0.2em`. This creates "breathing room" and a sense of luxury.
- **Hierarchy:** Use wide margins and asymmetrical placement. A `headline-lg` might be left-aligned while the supporting `body-md` is indented significantly to the right, creating a sophisticated tension on the page.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are too heavy for this brand. We achieve depth through the **Layering Principle.**

- **Ambient Shadows:** Only use shadows for floating elements (e.g., a "TA" Monogrammed Modal). Shadows must be extra-diffused: 
    - *Blur:* 40px–60px.
    - *Opacity:* Max 4%–8%.
    - *Color:* Tinted with `on-surface` (#2f3333), never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.
- **The Zero-Radius Mandate:** In alignment with architectural precision, all containers, buttons, and inputs must have a **0px to 2px radius**. Sharp corners communicate intentionality and modernism.

---

## 5. Components

### Buttons
- **Primary:** Rectangle (0px radius). Background: `primary` gradient. Text: `on-primary` (Uppercase, 0.15em tracking).
- **Secondary:** Ghost style. No background. "Ghost Border" (outline-variant @ 20%).
- **Hover State:** Shift background from `primary` to `primary-dim`. No "pop" or "bounce"; transitions should be slow (300ms) and linear.

### Cards & Lists
- **Rule:** Forbid divider lines. Use vertical whitespace (Token `10` or `12` from the spacing scale) to separate list items.
- **Images:** Architectural photography should be the hero. Images should occupy 100% of their container width, with text placed in a `surface-container-lowest` box that overlaps the image by 24px to create a 3D layered effect.

### Input Fields
- **Style:** Minimalist underline only, using `outline`. 
- **Active State:** Underline transitions to `primary` (#586155). 
- **Label:** `label-md` in `on-surface-variant`, always uppercase with high tracking.

### Additional Signature Component: The "Architectural Overlay"
A specialized component for project galleries where text descriptions reside on a semi-transparent `surface-bright` panel that slides over the imagery using a backdrop-blur.

---

## 6. Do's and Don'ts

### Do
- **DO** use generous whitespace (Token `16` and `20`) to allow the "feminine" and "minimalist" qualities to breathe.
- **DO** align the 'TA' monogram with vertical "fine lines" (0.5px `outline-variant`) to mimic architectural blue-print grids.
- **DO** use tonal shifts (e.g., `surface` to `surface-container-low`) to define the footer and header.

### Don't
- **DON'T** use rounded corners. Anything above 2px violates the "architectural" integrity of the system.
- **DON'T** use high-contrast black (#000000). Always use `on-surface` (#2f3333) for a softer, more sophisticated read.
- **DON'T** use standard "Drop Shadows." If an element doesn't feel separated enough, increase the background tonal difference instead of adding a shadow.
- **DON'T** crowd the logo. The 'Tatagiba Arquitetura' wordmark requires a minimum clear space of 2x the height of the 'TA' monogram.