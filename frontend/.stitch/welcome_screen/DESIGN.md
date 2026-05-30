# Design System Document: The Editorial Intelligence

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Curator"
This design system moves away from the utilitarian "dashboard" aesthetic and toward a high-end editorial experience. We are not just displaying data; we are curating democratic insight. The visual language balances the stoic authority of parliamentary tradition with the fluid transparency of modern technology.

**Breaking the Template:**
To achieve a signature feel, we reject the rigid, centered grid in favor of **intentional asymmetry**. Layouts should utilize "active whitespace"—where a heavy data visualization might be balanced by a significantly offset, high-contrast headline. We use overlapping elements (e.g., cards partially breaking out of their container boundaries) to create a sense of motion and depth that standard UI kits cannot replicate.

---

## 2. Colors

The palette is anchored in authoritative deep blues and surgical grays, accented by vibrant teals and greens that act as the "social pulse" of the platform.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are prohibited for sectioning. 
Visual boundaries must be defined solely through:
- **Background Color Shifts:** Use `surface-container-low` for secondary content sitting atop a `surface` background.
- **Tonal Transitions:** Define hierarchy by moving through the `surface-container` tiers.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-opaque materials. 
- **Base Layer:** `surface` (#f7f9fb)
- **Content Blocks:** `surface-container-low` (#f2f4f6)
- **Interactive Cards:** `surface-container-lowest` (#ffffff) for maximum "lift" and focus.
- **Tertiary Details:** `surface-container-high` (#e6e8ea) for inset data pods.

### The "Glass & Gradient" Rule
To elevate the experience, floating interactive elements (like navigation bars or hovering action menus) should utilize **Glassmorphism**. 
- **Implementation:** Use `surface` at 80% opacity with a `20px` backdrop-blur. 
- **Signature Textures:** Main CTAs or Hero data points should use a subtle linear gradient from `primary` (#001836) to `primary_container` (#002d5b) at a 135-degree angle to provide "visual soul."

---

## 3. Typography

The system employs a high-contrast pairings of **Manrope** for display and **Inter** for data.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "editorial" feel. 
    *   *Usage:* Use `display-lg` for key parliamentary figures and `headline-md` for section titles. The wide tracking of Manrope gives it a premium, spacious feel.
*   **Titles & Body (Inter):** A workhorse for legibility.
    *   *Usage:* Dense parliamentary data, voting records, and social comments must use `body-md`.
*   **Hierarchy as Identity:** By using extremely large `display` sizes against small, tech-focused `label-sm` metadata, we create an "Editorial Intelligence" look—highly readable but visually striking.

---

## 4. Elevation & Depth

We achieve dimension through **Tonal Layering** rather than structural lines.

*   **The Layering Principle:** Depth is "built" by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural highlight.
*   **Ambient Shadows:** For floating modals or "social" pop-overs, use a hyper-diffused shadow.
    *   *Specs:* `0px 20px 40px`, color: `on-surface` at 6% opacity. This mimics natural ambient light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#c3c6d0) at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** Use for "Social Engine" components (like active comment threads) to keep the data context visible underneath, softening the rigid boundaries of the analytical platform.

---

## 5. Components

### Cards & Lists
*   **The Rule:** No divider lines. Use `spacing-8` (2rem) of vertical whitespace or a shift to `surface-container-highest` to delineate list items.
*   **Data Cards:** Use `rounded-lg` (0.5rem) with `surface-container-lowest` background. Ensure a "nested" feel where internal data points are grouped by `surface-container-low` sub-containers.

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. No border. `rounded-md`.
*   **Secondary:** Ghost style. Background: `transparent`. Text: `primary`. Hover state: `surface-container-high`.

### Input Fields
*   **Style:** Minimalist "Underline" or "Tonal" style. Use `surface-container-high` for the input track with a `primary` indicator for the active state. 

### Custom Component: The "Pulse Indicator"
*   For parliamentary activity, use a small `secondary` (teal) dot with a `secondary_fixed_dim` outer glow to indicate live data updates or high social engagement.

### Custom Component: Social Intelligence Thread
*   Comment sections should not look like forums. Use a "threaded-glass" layout where comments are nested using increasing levels of backdrop-blur, creating a literal "depth of conversation."

---

## 6. Do's and Don'ts

### Do:
*   **DO** use `surface-dim` to create high-contrast "dark mode" moments within a light interface for focus.
*   **DO** lean into `display-lg` for single, impactful data points (e.g., "98% Attendance").
*   **DO** use the spacing scale religiously to maintain the "Editorial" rhythm—large gaps between sections (scale `16` or `20`).

### Don't:
*   **DON'T** use 1px black or grey borders. They break the premium "paper-and-glass" feel.
*   **DON'T** use pure black for text. Use `on_surface` (#191c1e) to maintain a sophisticated tonal range.
*   **DON'T** crowd the data. If a table feels dense, increase the `surface-container` padding rather than adding lines.
*   **DON'T** use standard "drop shadows." If it doesn't look like a soft glow, it's too heavy.