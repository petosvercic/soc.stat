# 05 — Canonical Result Format (Phase 2)

## Scope
This document defines one canonical result schema for a daily spectrum outcome.
It is documentation-only and does not define implementation.

## Canonical result object (keys must stay exactly as written)

```yaml
spectrum: string
symbol: string
name: string
todayOneLiner: string
gentleHook: string # optional
visibleByDefault:
  - spectrum
  - symbol
  - name
  - todayOneLiner
  - gentleHook # only when present
fogged:
  - key: string
    teaser: string
    unlockType: gold | premium
    priceGold: number # optional, required when unlockType=gold
    revealedText: string
unlockRules:
  gold:
    oneOffUnlock: true
    affectsTruth: false
  premium:
    expandsDepthAccess: true
    affectsTruth: false
```

## Field constraints
- `spectrum`: active spectrum for today (Phase 2 baseline: Emotional).
- `symbol`: compact recognition marker.
- `name`: neutral today-state name, never identity label.
- `todayOneLiner`: exactly one sentence, present-focused, non-authoritative.
- `gentleHook` (optional): invitation to optional depth, never pressure.
- `visibleByDefault`: always the baseline visibility set.
- `fogged`: optional depth layers shown as muted until unlocked.
- `unlockRules`: depth policy only; never changes core truth or personal worth.

## Fogged item shape (canonical)
Each fogged item must follow:
- `key`: stable internal label (e.g., `deeperShade`).
- `teaser`: short muted preview.
- `unlockType`: `gold` or `premium`.
- `priceGold?`: set only when `unlockType` is `gold`.
- `revealedText`: full text shown after unlock.

## Visibility and unlock policy
- Default view exposes only baseline result fields.
- Fogged layers are visible as existence, not content.
- Gold unlock is a voluntary one-off action.
- Premium may widen depth cadence, but cannot alter result truth.
- Neither gold nor premium changes social value, dignity, or identity meaning.

## Language safety (doc-level section, outside result object)
All values in the result object must obey:
- always “today”, never permanent identity;
- no diagnosis, no treatment framing;
- no authoritative commands or correction pressure;
- wording must allow a quiet exit without penalty.

## Emotional spectrum examples (canonical keys + Slovak values)

### Example A
```yaml
spectrum: Emotional
symbol: 🌧
name: Tichý dážď
todayOneLiner: Dnes sa emócie hýbu pomaly a ostávajú skôr v úzadí.
gentleHook: Jemnejší pohľad môže odkryť, čo si pýta viac priestoru.
visibleByDefault: [spectrum, symbol, name, todayOneLiner, gentleHook]
fogged:
  - key: deeperShade
    teaser: Pod povrchom je ešte teplejší tón.
    unlockType: gold
    priceGold: 1
    revealedText: Pod pokojom je aj jemná potreba blízkosti.
  - key: hiddenPattern
    teaser: Odpovede najprv chránili odstup.
    unlockType: premium
    revealedText: Najprv prichádza zadržanie, potom opatrné otvorenie.
unlockRules:
  gold: { oneOffUnlock: true, affectsTruth: false }
  premium: { expandsDepthAccess: true, affectsTruth: false }
```

### Example B
```yaml
spectrum: Emotional
symbol: 🌤
name: Tenké slnko
todayOneLiner: Dnes je prítomná ľahkosť, no zostáva aj jemný závoj.
visibleByDefault: [spectrum, symbol, name, todayOneLiner]
fogged:
  - key: lookBackEcho
    teaser: Podobný tón sa objavil aj nedávno.
    unlockType: gold
    priceGold: 1
    revealedText: Oproti poslednému razu je dnes menej vnútorného napätia.
  - key: extraSpectrumHint
    teaser: Vedľajšie spektrum môže obraz spresniť.
    unlockType: premium
    revealedText: Krátky vstup do ďalšieho spektra doplní chýbajúci detail.
unlockRules:
  gold: { oneOffUnlock: true, affectsTruth: false }
  premium: { expandsDepthAccess: true, affectsTruth: false }
```

### Example C
```yaml
spectrum: Emotional
symbol: 🌊
name: Odliv
todayOneLiner: Dnes energia ostáva bližšie pri sebe a menej smeruje navonok.
gentleHook: Hlbšia vrstva môže ukázať, čo drží tento pokoj pohromade.
visibleByDefault: [spectrum, symbol, name, todayOneLiner, gentleHook]
fogged:
  - key: deeperShade
    teaser: Pokoj je prítomný, ešte nie celkom usadený.
    unlockType: premium
    revealedText: Pokoj drží deň stabilný, no citlivosť ostáva otvorená.
  - key: hiddenPattern
    teaser: Reflexia volila pauzu pred reakciou.
    unlockType: gold
    priceGold: 1
    revealedText: Najsilnejší vzorec dňa je spomalenie pred rozhodnutím.
unlockRules:
  gold: { oneOffUnlock: true, affectsTruth: false }
  premium: { expandsDepthAccess: true, affectsTruth: false }
```
