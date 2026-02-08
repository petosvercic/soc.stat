# 05 — Canonical Result Format (Phase 2)

## Scope
This document defines the canonical result structure for one daily spectrum output.
It is conceptual and content-only, not implementation.

## Principles Anchored to FOUNDATION
- Result describes **today**, never identity.
- Result offers visibility, not diagnosis or correction.
- Result keeps a quiet exit path; depth is optional.
- Gold/Premium can increase depth, never change truth.

## Canonical Field Ordering
1. `spectrum`
2. `resultSymbol`
3. `resultName`
4. `todayOneLiner`
5. `gentleHook`
6. `visibleByDefault`
7. `fogged`
8. `unlockRules`
9. `languageSafetyNotes`

## Field Definitions

### 1) `spectrum`
- The active spectrum label for the day (Phase 2 baseline: Emotional).
- Short text only.

### 2) `resultSymbol`
- A compact visual token (emoji or glyph-like marker).
- Used for immediate recognition without explanation.

### 3) `resultName`
- A short, neutral name for the current-day state.
- Must avoid labels that imply diagnosis or permanent traits.

### 4) `todayOneLiner`
- One sentence that frames the state as present-day context.
- Must remain observational and non-authoritative.

### 5) `gentleHook`
- Optional curiosity line that opens depth without pressure.
- Written as an invitation to look, not a command.

### 6) `visibleByDefault`
Visible without any unlock:
- `spectrum`
- `resultSymbol`
- `resultName`
- `todayOneLiner`
- `gentleHook` (if present)

### 7) `fogged`
A list of optional depth layers, shown as present-but-muted:
- `deeperShade` (finer nuance of today’s state)
- `hiddenPattern` (light pattern seen in responses)
- `lookBackEcho` (today compared with a recent moment)
- `extraSpectrumHint` (optional pointer to another spectrum)

### 8) `unlockRules`
- **Gold unlock (one-off):** may reveal one fogged layer by user choice.
- **Premium context:** may allow broader access cadence to fogged layers.
- Neither gold nor premium may alter default result, social value, or dignity.

### 9) `languageSafetyNotes`
All fields must follow:
- no diagnosis,
- no direct evaluation of worth,
- no identity permanence,
- no pressure to continue.

## Emotional Spectrum — Example Result Instances

### Example A — "Soft Rain"
- `spectrum`: Emotional
- `resultSymbol`: 🌧
- `resultName`: Soft Rain
- `todayOneLiner`: Today feels quieter, with emotion moving in a slow line.
- `gentleHook`: A closer look may show what is asking for a little more space.
- `fogged`:
  - `deeperShade`: The quiet has a warm center under the surface.
  - `hiddenPattern`: Responses leaned toward holding back before opening.

### Example B — "Thin Sun"
- `spectrum`: Emotional
- `resultSymbol`: 🌤
- `resultName`: Thin Sun
- `todayOneLiner`: Today carries lightness, with a slight veil still present.
- `gentleHook`: One additional layer can clarify where the veil is thinnest.
- `fogged`:
  - `lookBackEcho`: Similar tone appeared recently, but with less tension now.
  - `extraSpectrumHint`: A short focus in another spectrum may sharpen this view.

### Example C — "Low Tide"
- `spectrum`: Emotional
- `resultSymbol`: 🌊
- `resultName`: Low Tide
- `todayOneLiner`: Today feels pulled inward, with energy staying close to shore.
- `gentleHook`: A deeper layer may reveal what keeps the shoreline calm.
- `fogged`:
  - `deeperShade`: Calmness is present, though not fully settled.
  - `hiddenPattern`: Reflection favored pause over quick reaction.
