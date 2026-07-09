# Fylos · Onboarding, drawn by hand (art-direction concept)

Ένα **before → after** concept που δείχνει μια πιο γραφιστική / editorial κατεύθυνση για την app,
με αφορμή το onboarding. Άνοιξε το [`index.html`](./index.html) σε browser.

## Η ιδέα σε μία πρόταση

Το Fylos έχει ήδη έναν πανέμορφο ζωγραφικό κόσμο (το βαμμένο **φίλος.**, τα watercolor σκύλος+γάτα,
το coral μελάνι) που ζει μόνο σε λίγα αρχεία εικονογράφησης και **δεν φτάνει ποτέ στο UI**. Εδώ ο
κόσμος αυτός μπαίνει μέσα στο προϊόν: editorial τυπογραφία, ζωγραφισμένα σημάδια, hand-stitched path
και οι πραγματικές εικονογραφήσεις ως ολόκληρες **πλάκες (book-plates)**.

## Τι αλλάζει (σε σχέση με το σημερινό onboarding)

| Σήμερα | Concept |
|---|---|
| Εικονογράφηση σε peach κύκλο + sparkles, κεντραρισμένο | Full **book-plate** watercolor πάνω στο χαρτί (multiply, χωρίς κουτί) |
| Ένα centered card ίδιο με κάθε pet app | Editorial magazine layout, ασύμμετρο, με index `01 — 04` |
| Sans τίτλοι | **Serif italic** (Instrument Serif) + ζωγραφισμένο arc κάτω από λέξη-κλειδί |
| Solid μπάρα προόδου | **Paw-path** από κουκκίδες, η κουκκίδα-σύντροφος ως ενεργό βήμα |
| Flat data rows | UI ως **paper notes** και βαμμένα chips |

## Art-direction tokens

- **Χαρτί**: cream `#F6F1E9` με λεπτή υφή (grain)
- **Μελάνι**: coral `#E85D2A`, terracotta `#B85A26`, ink `#2A211B`
- **Τυπογραφία**: Instrument Serif (italic, display) · Inter (body) · mono (labels/index)
- **Μοτίβα**: painted arc · κουκκίδα · paw-path · book-plate εικονογραφήσεις

## Σημειώσεις

- Χτισμένο με τα **πραγματικά** watercolors του `public/onboarding/` (downscaled + embedded ως data URIs, ώστε το αρχείο να είναι self-contained).
- Το `index.html` φορτώνει Instrument Serif + Inter από Google Fonts.
- Επόμενο βήμα αν αρέσει: το ίδιο λεξιλόγιο σε Home / Pet profile, και live υλοποίηση των οθονών.
