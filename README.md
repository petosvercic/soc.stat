📜 FOUNDATION.md
SOC.STAT — CONCEPTUAL & PRODUCTION FOUNDATION

Tento dokument je záväzný koncepčný základ projektu soc.stat.
Všetky budúce rozhodnutia, implementácie a rozšírenia musia byť s ním v súlade.
V ďalších fázach budú jeho časti rozdelené do samostatných dokumentov.

## Aktuálna implementácia (referencie)

- FOUNDATION sekcie: 3 (Axioms), 5 (Jazyk systému), 6 (Denný tok), 8 (Checklist).
- Produkčná fáza: 4 (Production).

## Nasadenie a secrets konfigurácia

- Aplikácia načíta premenné z `.env.lokal` a `.env.local` (ak existujú) a následne z prostredia.
- Pre produkciu (`NODE_ENV=production`) sú povinné premenné: `APP_API_TOKEN`, `PAYWALL_TOKEN`, `PAYWALL_PROVIDER_URL`, `PAYWALL_PUBLIC_KEY`.
- Vzor konfigurácie je v `.env.example`.
- Súbory s tajomstvami (`.env.lokal`, `.env.local`) sú git-ignorované a nesmú byť commitované.
- Pre Vercel je pridaný `vercel.json` a serverless entrypoint `api/index.js`.
- Chránené endpointy vyžadujú hlavičky:
  - `x-app-token: <APP_API_TOKEN>`
  - `x-user-id: <user-id>`
- Paywall konfigurácia endpoint (`GET /paywall/config`) vyžaduje `x-paywall-token`.

## Rozdelené špecifikácie (aktuálny stav)

- `FOUNDATION_NORMALIZED.md` — kanonická normalizovaná textová špecifikácia.
- `SPEC_BUILD.md` — implementačná build špecifikácia.
- `SPEC_CONTRACTS.ts` — kontrakty, typy a API rozhrania.

1. JEDNOVETNÁ DEFINÍCIA PRODUKTU (AXIOM REALITY)

Soc.stat robí viditeľným aktuálne vnútorné nastavenie človeka a umožňuje naň vedome reagovať vo vzťahoch, bez nutnosti ho slovne vysvetľovať.

Ak akýkoľvek návrh:

nezvyšuje viditeľnosť vnútorného nastavenia

alebo vytvára tlak na vysvetľovanie

→ nepatrí do soc.stat.

2. MANIFEST (PREČO SOC.STAT EXISTUJE)

Soc.stat vznikol z presvedčenia, že:

ľudia denne niečo prežívajú

ale len zriedka to majú možnosť vidieť bez hluku

u seba aj u druhých

bez potreby slov, obhajovania alebo vysvetľovania

Soc.stat:

neponúka riešenia

neponúka diagnózy

neponúka nápravu

Ponúka pohľad
a dôveruje, že pohľad je často viac než rada.

3. AXIOMS (NEPREKROČITEĽNÉ PRAVDY)
AXIOM 1 – Viditeľnosť je silnejšia než vysvetlenie

Ak musí používateľ niečo pochopiť, aby systém fungoval, je to zle navrhnuté.

AXIOM 2 – Vždy ide len o „dnes“

Soc.stat nikdy netvrdí, kým človek je.
Iba ukazuje, ako pôsobí v daný deň.

AXIOM 3 – Ticho je plnohodnotná interakcia

Moment bez výzvy, bez CTA a bez tlaku je funkčný stav systému.

AXIOM 4 – Zvedavosť je legitímna, tlak nie

Používateľ môže chcieť vedieť viac.
Nikdy však nesmie mať pocit, že musí.

AXIOM 5 – Systém nie je autorita

Soc.stat nehodnotí, nesúdi, nenapráva.
Je tichým pozorovateľom.

4. MANTINELS (OCHRANNÉ HRANICE)
MANTINEL 1 – Žiadna gamifikácia identity

žiadne levely osobnosti

žiadne skóre človeka

žiadne porovnávanie „kto je viac“

MANTINEL 2 – Žiadna diagnostika

Ak by text mohol pôsobiť ako psychologická alebo zdravotná rada, nepatrí sem.

MANTINEL 3 – Žiadne nútené návraty

Notifikácie sú impulz, nie povinnosť.

MANTINEL 4 – Systém sa nevysvetľuje

Ak potrebuje manuál, je zle navrhnutý.

MANTINEL 5 – Peniaze nemenia pravdu

Premium ani gold nikdy nemenia:

výsledky

obraz používateľa pre iných

„hodnotu“ človeka

Menia iba hĺbku pohľadu.

5. JAZYK SYSTÉMU (ZÁKONY KOMUNIKÁCIE)

systém nikdy nehovorí autoritatívne

vždy ide o „dnes“, nie o identitu

žiadne diagnózy ani hodnotenie

otázka je silnejšia než rada

systém sa neospravedlňuje

nemotivuje, netlačí, nekarhá

jazyk znie ľudsky, nie osobne

každá veta musí zniesť tichý odchod

ak si nie sme istí, mlčíme

6. DENNÝ TOK POUŽÍVATEĽA (REFERENČNÝ RÁMEC)

Stav pred vstupom – app nie je stredobodom dňa

Impulz – jemný signál, nie výzva
1.5 Tichý signál kontinuity (ak existuje)

Výrok dňa – ukotvenie, nie vysvetlenie

Rozhodovací moment – dobrovoľnosť

Vstup do jedného spektra

Mikro-reflexia (otázky)

Výsledok – pomenovanie

Ticho – absorpcia

Jemné rozšírenie (možnosť)

Odchod / návrat do dňa

7. SEKUNDÁRNA EKONOMIKA (GOLD SYSTEM)
Zámer:

Gold je nástroj na uspokojenie zvedavosti v momente, keď vznikne.

Gold nie je:

odmena za výkon

motivácia k činnosti

náhrada predplatného

Gold je:

vedomé rozhodnutie

jednorazový akt pohľadu

prirodzene sa míňa

Gold sa používa výhradne na:

hlbší pohľad

odkrytie zahmlenej vrstvy

spätný pohľad

extra spektrum mimo denného výberu

8. PRODUKČNÝ CHECKLIST (MAPA POSTUPU)
FÁZA 1 – Foundation

(definícia, tok, jazyk, axiómy)

FÁZA 2 – Core content

(jedno spektrum, formát výsledku, výrok dňa)

FÁZA 2.5 – Gold system

(zvedavosť, nie tlak)

FÁZA 3 – Social layer

(friend view ako odvodený obraz)

FÁZA 4 – Production

(preklad do UI a kódu)

Ak nevieme, do ktorej fázy vec patrí → nerobí sa.

9. ZÁVEREČNÁ POZNÁMKA

Soc.stat nie je produkt pre všetkých.
A nemá byť.

Ak sa niekedy zjednoduší tak, že stratí ticho,
už to nebude soc.stat.

🔒 POZNÁMKA K BUDÚCNOSTI

V ďalšej fáze budú jednotlivé kapitoly tohto dokumentu rozdelené do samostatných súborov (Manifest, Axioms, Language, Flow, Gold, Checklist).
