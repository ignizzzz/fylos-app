# FYLOS UX Copy System

The canonical microcopy library. Tone: **calm, premium, human. Never corporate.**
Every string in the product should either come from here or sound like it does.

---

## 1. Voice rules

1. **The pet is a person.** Use their name whenever we know it. "Add a photo of Leo", never "Add pet photo". The app cares about Leo, not about data fields.
2. **Calm over clever.** Short sentences. One idea each. No exclamation marks except moments of genuine celebration. And even then, one.
3. **Say what happens next, not what went wrong inside.** Errors name the fix, not the failure code.
4. **Verbs first, outcomes named.** A button says what it does: "Place hold · CHF 19", "Add Leo", "Request booking". Never "Submit", "OK", "Proceed".
5. **Money without anxiety.** State amounts as facts, once, where the decision happens. Never tally what someone has spent where they didn't ask for it.
6. **No dashes. Ever.** No em dashes, no en dashes, no hyphens as pauses. Sentences are whole: split them with a full stop or a comma instead. The middot · stays only as a data separator (Mon, Feb 16 · 10:00), never inside prose.
7. **Banned:** "Oops", "Uh oh", "Sorry for the inconvenience", "successfully", "users", "transaction", "submit", "error occurred", emojis in UI, dashes in prose, ALL-CAPS sentences (tiny badges like PRO · LIVE · SOON are fine).
8. **Sentence case everywhere.** Including titles and buttons.
9. **Reassure with specifics.** "Released if Lukas declines" beats "fully refundable".

---

## 2. Onboarding & welcome

| Surface | Copy |
|---|---|
| Add pet. Welcome title | **Let's add your pet** |
| — subcopy | A quick setup so sitters, walkers and your vet know exactly how to care for them. |
| — reassurance | Takes about a minute. You can edit anything later. |
| — CTA | Get started |
| Add pet. Step intros | Let's meet your pet · About {name} · A few health details |
| Add pet. Done | **Welcome, {name}!** / {name}'s profile is ready. Your walkers, sitters and vet can now see everything they need. / CTA: See {name}'s profile |
| Become a Pro. Welcome | **Earn with fylos** / Walk or sit for pets near you. Most pros in Zürich earn CHF 400–900 a month on their own schedule. |
| — value points | You set the prices. Keep 85% of every booking · You choose the hours · Insured through fylos |
| — done | **Application sent** / We review every pro by hand. You'll hear from us within 48 hours. |
| First app open (future) | **Pets, looked after.** / Care, health and trusted people. All in one place. / CTA: Add your first pet |

---

## 3. Empty states

Pattern: *what this is → why it's empty → the one next step.* Never apologise for emptiness.

| Screen | Title | Body | CTA |
|---|---|---|---|
| Pets (none) | No pets yet | Add your first pet to track their health, care and everything in between. | Add your first pet |
| Coming up (pets) | Nothing coming up | You're all caught up. New reminders show here. | — |
| Bookings. Upcoming | No upcoming bookings | Book a walk or sitting from Discover. | Explore services |
| Bookings. Past | Nothing here yet | Your booking history will live here. | — |
| Saved providers | Nothing saved yet | Tap the heart on a provider to keep them here. | — |
| Journal | Nothing here yet | Log a walk, meal or moment to start {name}'s journal. | Log the first entry |
| Inbox | All quiet | We'll let you know when something needs you. | — |
| Search. No results | No one matches "{query}" | Try a wider area or fewer filters. | Clear filters |
| Reviews (new pro) | No reviews yet | First bookings bring first reviews. | — |
| Pro requests | Inbox zero | New requests appear here. Stay online to receive more. | — |
| Pro earnings (new) | Your first franc awaits | Earnings appear after your first completed booking. | — |

---

## 4. Errors

Pattern: *what happened → how to fix it.* Plain words, no blame, no codes.

| Case | Copy |
|---|---|
| Payment declined | **Your bank said no.** No hold was placed. Try another card, or check with your bank. / CTA: Try another card |
| Offline | **You're offline.** We'll reconnect the moment you're back. |
| Slot just taken | **That time was just booked.** {name} has other openings today. / CTA: See available times |
| Request expired | Request expired. {provider} didn't respond within 24 h. You weren't charged. |
| Photo upload failed | That photo didn't make it. Tap to try again. |
| Location permission | **fylos needs your location** to find walkers near you. You can change this anytime in Settings. / CTA: Allow location |
| Chat message failed | Not sent. Tap to retry. |
| Form. Name missing | Every pet needs a name. |
| Form. Bio too short | {n} more characters. Owners read this first. (→ on success: Looks good) |
| Form. IBAN invalid | That IBAN doesn't look right. Swiss IBANs start with CH. |
| Form. Price empty | Set a price |
| Generic (last resort) | **Something broke on our side.** It's not you. Try once more in a moment. |

---

## 5. Loading & in-progress

Set expectations; never just "Loading…".

| Moment | Copy |
|---|---|
| Confirming payment hold | Confirming with your bank… |
| Sending booking request | Sending to {provider}… |
| Finding providers | Finding people near you… |
| Uploading photo | Adding photo… |
| Live walk header sub | {provider} · with {pet} |
| Pending booking line | Waiting for {provider} to confirm. |
| Auto-expiry notice | Auto-expires in {n} h if not confirmed. You won't be charged. |

---

## 6. Confirmations & destructive dialogs

Name the action; state the consequence; buttons repeat the action.

| Dialog | Title | Body | Buttons |
|---|---|---|---|
| Cancel booking | Cancel this booking? | {provider} will be notified. Any hold on your card is released. | Cancel booking / Keep it |
| Remove pet | Remove {name}? | Their profile, health records and journal go too. This can't be undone. | Remove {name} / Keep {name} |
| Remove card | Remove Visa ··4242? | Upcoming bookings will need another payment method. | Remove card / Keep card |
| Log out | Log out? | Your pets stay right here for when you're back. | Log out / Stay |
| Lost mode | Activate lost mode? | Nearby fylos members will be alerted and your contact details shown on {name}'s public page. | Activate lost mode / Cancel |
| Pro. Decline request | Decline this request? | {owner} will be told you're not available. No reason shown. | Decline / Go back |
| Pro. End walk | End the walk? | {owner} gets the summary and the payment completes. | End walk / Not yet |

---

## 7. Success & toasts

One line. Warm, specific, gone in two seconds.

- Request sent. Waiting for confirmation
- Booking confirmed. {dow} {time} with {provider}
- Added to {name}'s journal
- Reminder on. It'll appear in Coming up
- Link copied
- Changes saved
- Photo sent to {owner}
- Accepted. {pet} is booked in *(pro)*
- You're online · You're offline. No new requests *(pro)*
- Payout on its way. Lands Monday *(pro)*

---

## 8. CTA inventory (canonical labels)

| Intent | Label |
|---|---|
| Primary forward in flows | Continue |
| Create pet | Add {name} → fallback: Add pet |
| Booking | Request booking · CHF {n} → Place hold · CHF {n} |
| Pro application | Submit for review |
| Skip optional step | Skip |
| Save edits | Save changes |
| Open chat | Message {firstname} |
| Repeat booking | Book again / Rebook |
| See more of a list | See all |
| Empty-state actions | Add your first pet · Log the first entry · Explore services |

Never: Submit · OK · Confirm (alone) · Next · Learn more.

---

## 9. Notifications (push + inbox)

Title ≤ 35 chars; body names pet/person and the next step.

| Event | Title | Body |
|---|---|---|
| Request sent | Booking request sent | {svc} with {provider} · {date}. We'll let you know the moment they confirm. |
| Confirmed | {provider} confirmed | {svc} · {date}. {pet} has a date. |
| Walker arriving | {provider} is on the way | Arriving around {time} to pick up {pet}. |
| Photo update | New photo of {pet} | {provider} sent an update from the walk. |
| Walk done | {pet} is home | {n} min · {km} km. The summary's ready. |
| Vaccine due | {vaccine} due soon | {pet}'s {vaccine} is due {when}. Book a vet visit when you're ready. |
| Expired | Request expired | {provider} didn't respond in time. You weren't charged. Try someone else? |
| Pro. New request | New request | {svc} · {date} · {dist} away. Reply fast. It boosts your ranking. |
| Pro. Payout | Payout sent | CHF {n} is on its way to your bank. |

---

## 10. Money & trust lines (exact, reusable)

- Pay after the service · Visa ··4242. Charged only once it's done
- Hold now. Charged after the service
- Secured by Stripe. Released if {firstname} declines
- Cards are stored & charged securely by our partners. fylos never sees or holds your card details.
- Credits are a reward balance, not money we hold. Used toward bookings, not redeemable for cash.
- You keep 85% of every booking. *(pro. Always the positive framing; "fylos keeps 15%" only in fine print)*
- Paid out weekly via Stripe. fylos never holds your money.

---

## 11. Localization notes

- **Language strategy:** EN base; DE-CH and EL next. Write source strings without idioms ("first francs" is fine. CHF market; review per locale).
- **German expands ~30%**. Buttons already verb-first survive this; keep CTAs ≤ 22 chars where possible.
- **Du, not Sie** in DE. Matches the warm register ("Dein Spaziergang", not "Ihr Termin").
- **Pet-name interpolation** is gender-free by design. Keep sentences that don't inflect around {name}.
- **Dates/currency:** CHF 1'240.55 (Swiss apostrophe) in DE-CH; keep `CHF` prefix, never `Fr.`.
- Avoid "walkies"-style EN cuteness. Doesn't translate; warmth comes from the pet's name, not slang.
