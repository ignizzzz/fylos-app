# Fylos · Social Templates

Πέντε συνεργαζόμενα templates για τα social media του Fylos, σε **post 4:5** και **story 9:16**.
Χτισμένα πάνω στο `FYLOS_DESIGN_SYSTEM.md` και το `FYLOS_PRODUCT_DIRECTION.md`: warm-light,
peach accent, η πορτοκαλί κουκκίδα-σύντροφος, Inter, απαλά cards. Χωρίς dark, χωρίς alarmist χρώματα.

> Αυτά είναι **προσχέδια για να διαλέξουμε κατεύθυνση**. Μόλις κλειδώσουμε 1–2, τα κάνω τελικά
> με καθαρά πεδία κειμένου έτοιμα για κάθε post.

## Τι υπάρχει

Άνοιξε το [`index.html`](./index.html) σε browser. Δείχνει και τα 5 σε post + story:

| # | Template | Ζώνη | Καλό για |
|---|----------|------|----------|
| 01 | **Companion** | S · warmth | quote / δήλωση / σκέψη (serif) |
| 02 | **Reminder** | R · coach-quiet | tip / υπενθύμιση σε στυλ κάρτας του app |
| 03 | **This week** | R · data | **πίνακες**, νούμερα, chart (scorecards + bars + list) |
| 04 | **Today** | L · live | πρόγραμμα / timeline / live στιγμή (**διάγραμμα**) |
| 05 | **Meet** | S · shareable | intro / ανακοίνωση / shareable pet card |

## Διαστάσεις export

- **Post 4:5** → 1080 × 1350 px
- **Story 9:16** → 1080 × 1920 px

Κάθε canvas είναι σε **container-query units**, οπότε το ίδιο markup βγαίνει καθαρό από preview
μέχρι πλήρη ανάλυση: βάζεις το πλάτος του `.canvas` στα `1080px` και τραβάς screenshot.

## Πώς αλλάζω κείμενο

Όλο το περιεχόμενο των templates ζει στον πίνακα `templates` μέσα στο `<script>` του `index.html`
(τίτλοι, ονόματα, ημερομηνίες). Αλλάζεις τα strings και ανανεώνει.

## Γλώσσα

Τα προσχέδια είναι στα **Αγγλικά**, ίδια με το canonical `FYLOS_UX_COPY.md` (launch market: Ελβετία).
Το copy αλλάζει εύκολα σε **DE-CH / FR-CH / Ελληνικά** — πες μου ποια θέλεις.

## Κανόνες brand που τηρούνται

- Warm light μόνο · καμία dark επιφάνεια
- Ένα peach accent · πράσινο μόνο για καλά νέα · κόκκινο ποτέ εκτός emergency
- Sentence case παντού · χωρίς παύλες στο prose · χωρίς emoji διακόσμηση
- Το κατοικίδιο είναι πρόσωπο (με όνομα) · η κουκκίδα-σύντροφος σε κάθε post
