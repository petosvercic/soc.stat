# soc.stat – normalizovaný textový špecifikačný súbor

Tento dokument je **kanonická textová špecifikácia** systému **soc.stat** určená pre:

- LLM-based autocreate prostredie (Codex a podobné)
- ľudskú kontrolu architektúry, významu a hraníc systému

Dokument **nenahrádza kód**, ale definuje **filozofiu, stavy, invarianty a očakávané správanie**, z ktorých má byť kód jednoznačne odvodený.

## Foundation reference a produkčná fáza

- FOUNDATION sekcia: 3 (Axioms), 5 (Jazyk systému), 6 (Denný tok), 8 (Checklist)
- Produkčná fáza: 1 (Foundation)

---

## 1. Základná identita systému

soc.stat je **normálny webový systém** (nie standalone experiment), ktorého účelom je:

- umožniť jednotlivcovi **tichú dennú sebareflexiu**
- vytvárať **jemnú sociálnu vrstvu** bez tlaku na interakciu
- generovať **stav**, nie výzvu, nie úlohu, nie cieľ

soc.stat **nie je**:

- hra
- kvíz
- motivačný nástroj
- sociálna sieť založená na výkone

---

## 2. Filozofia systému

Základné princípy:

1. **Ticho je plnohodnotný stav**  
   Absencia akcie je rovnocenná akcii.

2. **Systém nevyžaduje odpovede**  
   Používateľ nič „neplní“, len prechádza stavmi.

3. **Žiadne CTA v jadrovom toku**  
   Žiadne: pokračuj, klikni, odpíš, odpoveď, zdieľaj teraz.

4. **Žiadna ekonomika, žiadne skóre**  
   Hodnota vzniká z prítomnosti, nie z akumulácie.

5. **Sociálna vrstva je pasívna**  
   Viditeľnosť ≠ interakcia.

---

## 3. Kanonické stavy systému (Flow Contract)

Systém má **explicitne definované stavy**, ktoré sú jediným povoleným rámcom toku.

### 3.1 Stav: SPECTRUM

- Účel: naladenie, nie rozhodovanie
- Obsah: jemné tvrdenia, nálady, vektory pocitov
- Používateľ: nič nevyberá
- Systém: nič nežiada

### 3.2 Stav: IMPULSE

- Účel: vnútorný pohyb
- Obsah: krátke podnety, nie otázky
- Používateľ: môže reagovať alebo nereagovať
- Reakcia je nepovinná a nemá skóre

### 3.3 Stav: RESULT

- Účel: pomenovanie stavu
- Obsah: textový opis momentálneho naladenia
- Výsledok nie je hodnotenie ani diagnóza

### 3.4 Stav: SILENCE

- Účel: uzavretie toku
- Obsah: ticho, prázdno, priestor
- Žiadne CTA
- Žiadne navádzanie
- Stav môže trvať ľubovoľne dlho

---

## 4. Pravidlá prechodu stavov

- Prechod je **lineárny a jednosmerný**
- Žiadny stav sa nepreskakuje
- Stav SILENCE je vždy posledný
- Používateľ nemá možnosť „reštartovať“ tok v rámci dňa

---

## 5. Jazykové invarianty (Copy Contract)

V celom systéme platí:

Zakázané:

- otázniky (?) v jadrovom toku
- budúci čas („zajtra“, „budeš“)
- výzvy („skús“, „urob“, „pokračuj“)
- hodnotenie („lepšie“, „horšie“, „správne“)

Povolené:

- opisné vety
- neutrálne pomenovania
- otvorené významy

---

## 6. Sociálna vrstva (neskoršia, ale definovaná)

Sociálna vrstva **existuje**, ale je:

- pasívna
- opt-in
- nevyžaduje interakciu

Princípy:

- priateľ vidí, že si „bol v stave“, nie čo si robil
- žiadne lajky
- žiadne komentáre v jadrovom toku
- zdieľanie je mimo hlavného flow

---

## 7. Zadávanie a vstupy

- Používateľ **nemusí nič zadávať**
- Ak zadá, je to:
  - krátke
  - bez vyhodnotenia
  - bez ukladania ako výkon

---

## 8. Technické očakávania pre LLM autocreate

LLM (Codex) musí:

- považovať tento dokument za **source of truth**
- nikdy nevkladať CTA do stavov
- nikdy nepridávať ekonomiku
- explicitne modelovať stavy ako enum / state machine
- mať možnosť testovať porušenie invariantov

LLM **nesmie**:

- dopĺňať gamifikáciu „pre lepší engagement"
- optimalizovať na retention
- zavádzať motiváciu namiesto významu

---

## 9. Záver

soc.stat je systém, kde:

- význam vzniká z prítomnosti
- ticho je výstup
- sociálnosť je jemná stopa, nie tlak

Tento dokument má slúžiť ako **mentálny a technický kompas** pre každé ďalšie rozhodnutie v kóde.
