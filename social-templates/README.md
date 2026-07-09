# Fylos · Social Templates

Το working set για το feed του Fylos: **4 συνεργαζόμενα templates**, το καθένα σε **post 4:5**
και **story 9:16**. Χτισμένα πάνω στο `FYLOS_DESIGN_SYSTEM.md` και το `FYLOS_PRODUCT_DIRECTION.md`:
warm-light, peach accent, η πορτοκαλί κουκκίδα-σύντροφος, Inter, απαλά cards. Copy στα Αγγλικά.

Άνοιξε το [`index.html`](./index.html) σε browser.

## Τα 4 templates

| # | Template | Ζώνη | Καλό για |
|---|----------|------|----------|
| 01 | **Companion** | S · warmth | quote / δήλωση / σκέψη (serif) |
| 02 | **Reminder** | R · coach-quiet | tip / υπενθύμιση σε στυλ κάρτας του app |
| 03 | **This week** | R · data | νούμερα, **πίνακες**, chart (scorecards + bars + list) |
| 04 | **Today** | L · live | πρόγραμμα / timeline / live στιγμή |

> Το draft **05 Meet** (shareable gradient card) υπάρχει στο ιστορικό του branch αν το θελήσουμε πίσω.

## Πώς φτιάχνω ένα post (αλλαγή κειμένου)

Όλα τα κείμενα ζουν σε **ένα** αντικείμενο `CONTENT` στην κορυφή του `<script>` μέσα στο `index.html`
(όνομα κατοικίδιου, τίτλοι, ημερομηνίες, νούμερα, timeline). Αλλάζεις τα strings, save, refresh.
Δεν αγγίζεις layout.

```js
reminder:{
  pill:'Coming up',
  title:'Bobby’s rabies booster is in 14 days.',
  body:'We’ll remind you again closer to the date. Let’s plan it.',
  when:'Due Fri, Mar 20'
}
```

## Export

Πάτα **Export size · 1080px** πάνω δεξιά και τράβα screenshot το canvas που θες:

- **Post 4:5** → 1080 × 1350 px
- **Story 9:16** → 1080 × 1920 px

Κάθε canvas είναι σε **container-query units**, οπότε μένει καθαρό σε κάθε ανάλυση.

## Γραμματοσειρές

Το `index.html` φορτώνει τις πραγματικές γραμματοσειρές του app (Inter, Nunito 800,
Instrument Serif, JetBrains Mono) από Google Fonts, ίδιες με το `index.html` της εφαρμογής.

## Κανόνες brand που τηρούνται

- Warm light μόνο · καμία dark επιφάνεια
- Ένα peach accent · πράσινο μόνο για καλά νέα · κόκκινο ποτέ εκτός emergency
- Sentence case παντού · χωρίς παύλες στο prose · χωρίς emoji διακόσμηση
- Το κατοικίδιο είναι πρόσωπο (με όνομα) · η κουκκίδα-σύντροφος σε κάθε post
