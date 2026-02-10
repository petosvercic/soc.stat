# SPEC_BUILD.md – implementačná špecifikácia (pre Codex)

Tento dokument je **build-spec**: odstraňuje interpretačné diery. Ak je niečo v rozpore s `FOUNDATION_NORMALIZED.md`, platí **normalizovaný súbor**.

## Foundation reference a produkčná fáza

- FOUNDATION sekcia: 6 (Denný tok), 8 (Produkčný checklist)
- Produkčná fáza: 4 (Production)

## A. Produktový cieľ

Postaviť webovú aplikáciu soc.stat, ktorá realizuje denný tok stavov:

`SPECTRUM → IMPULSE → RESULT → SILENCE`

a pridáva jemnú sociálnu vrstvu (priateľstvá, feed „stôp“, zdieľanie) **mimo jadrového toku**.

## B. Informačná architektúra (routy / stránky)

### Verejné

- `GET /` – landing (čo to je, bez CTA typu „začni teraz“; povolené neutrálne „Vstúpiť“)
- `GET /login` – prihlásenie
- `GET /register` – registrácia

### Autentifikované – jadrový denný tok

- `GET /today` – vstup do dnešného toku (ak už dokončené → presmeruj na `/silence`)
- `GET /flow/spectrum` – stav SPECTRUM
- `GET /flow/impulse` – stav IMPULSE
- `GET /flow/result` – stav RESULT
- `GET /silence` – stav SILENCE (dnešný koniec)

### Autentifikované – história a sociálna vrstva (mimo flow)

- `GET /history` – kalendár dní (len prítomnosť/stopa; bez hodnotenia)
- `GET /day/:yyyy-mm-dd` – detail dňa (Result text + meta)
- `GET /friends` – správa priateľov
- `GET /friends/requests` – žiadosti
- `GET /feed` – pasívny feed „stôp“ priateľov (len signál prítomnosti)
- `GET /share/:runId` – verejný read-only share link (opt-in)

### Nastavenia

- `GET /settings` – účet, súkromie, zdieľanie, notifikácie

## C. UX pravidlá per stav

### C1. SPECTRUM

- UI je čitateľský panel (1–3 krátke vety, neutrálne)
- povolený 1 ovládací prvok: „Ďalej“ (nie „pokračuj“)
- žiadne otázky, žiadne hodnotenie, žiadne voľby

### C2. IMPULSE

- UI: 1 krátky podnet (nie otázka)
- nepovinná reakcia: textové pole (max 240 znakov) **alebo** preddefinované „tiché reakcie“ (napr. 3 ikonky bez popisu)
- povolené tlačidlá: „Preskočiť“, „Ďalej“
- preskočenie je rovnocenné vyplneniu

### C3. RESULT

- UI: výsledný opis (1–4 vety)
- voliteľné: „Uložiť poznámku“ (text max 240 znakov) mimo hlavnej plochy
- povolené tlačidlo: „Zatvoriť“ alebo „Dokončiť“ (nie „zdieľaj“, nie „pozvi“)

### C4. SILENCE

- UI: prázdno + jemný text (1 veta max) bez výzvy
- **žiadne CTA**
- jediné povolené navigácie sú mimo jadra: horné menu (History, Feed, Settings). Menu nesmie pôsobiť ako „ďalší krok v flow“.

## D. Sociálna vrstva – presné pravidlá

### D1. Priateľstvo

- model: obojstranné spojenie (request → accept)
- nie je „follow"

### D2. Feed

- feed zobrazuje iba: používateľ, dátum, stav (napr. „bol prítomný“), prípadne anonymizovaný „mood token“ (voliteľné)
- feed **nezobrazuje**:
  - text z IMPULSE reakcie
  - celý RESULT text, pokiaľ používateľ explicitne nezapne share

### D3. Share

- share je **opt-in per deň**
- vytvorí verejný link `GET /share/:runId`
- na share stránke sú iba:
  - dátum
  - RESULT text (ak povolené)
  - žiadne CTA, žiadne „pridaj sa"

## E. Denná logika (gating)

- každý používateľ má max 1 `DailyRun` na deň
- ak run existuje a je `COMPLETED`, `/today` ide na `/silence`
- run je viazaný na lokálny dátum používateľa

## F. Copy & zakázané vzory (hard fail)

Hard-fail validátor musí odmietnuť texty v jadrovom flow, ak obsahujú:

- `?`
- „pokračuj", „klikni", „zdieľaj", „pozvi", „odmeň", „získaj"
- „zajtra", „budúci týždeň", „o chvíľu" (projekcie)
- hodnotiace slová typu „správne/nesprávne", „lepšie/horšie"

## G. Testovateľné akceptačné kritériá

- AC1: Používateľ nemôže preskočiť stav (direct URL musí presmerovať na správny aktuálny stav)
- AC2: SILENCE stránka neobsahuje CTA tlačidlá
- AC3: IMPULSE reakcia je voliteľná a neovplyvní vznik RESULT
- AC4: Feed nikdy nezobrazuje súkromný text bez share
- AC5: Share link je read-only a nevyžaduje prihlásenie
