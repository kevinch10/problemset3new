# prompts.md

## Problem Set 4: revision (Step 5)

Prompts given to Claude Code on Tuesday 29 September 2026. Each repair used
the course's sceptical-reviewer prompt (ROLE / CONTEXT / GOAL / OUTPUT /
GUARDRAILS), with CONTEXT filled in as below. The agent's arguments and my
decision follow each one.

Shared context for every prompt:
- Live address: https://problemset3new.vercel.app/
- Who the product is for, and what it does for them: A Singapore homebuyer or
  renter uses the HDB Resale Price Explorer to compare HDB resale transactions
  by town and flat type and understand how resale prices differ and have
  changed since 2017.

Note on the process: the agent wrote code for all seven repairs before I had
asked it to argue (two bundled local commits, never pushed; kept on branch
ps4-draft-bundled). Its arguments below were made afterwards, against both
the proposed repair and that code. After reading them, I reset main to the
reviewed version (abab8f3) and had each repair rebuilt on its own, as
decided below.

---

## Repair 1: "All Towns" cut off at June 2018

**Finding (SS, finding 1).**
- Where: Explore Prices, with TOWN / LOCATION set to "All Towns across
  Singapore", search box empty and All Flat Types.
- What they did, what they saw: the page said "Based on 30000 recorded
  transactions (2017 – Present)", median $412,000, but the newest sale was
  June 2018. /api/hdb with no town returned the first 30,000 of 241,357
  records, starting at January 2017.
- Heuristic: 1, Visibility of System Status.
- Screen or system: system. /api/hdb cuts the answer at 30,000 records, oldest
  first, and does not tell the screen.
- Severity: 4, damage to the product's standing.
- Repair: "All Towns" figures cover every sale up to the latest month, or the
  page says plainly which period and how many sales they are based on.

**Evidence:** raised by 1 groupmate (SS); reproduced on 29 September 2026
(30,000 of 241,483, 2017-01 to 2018-06).

**Repair I propose:** the route returns the newest sales instead of the
oldest and says how much it covers; the page states the count and period.

**Arguments**
1. It solves the problem the finding describes, but only through its second
   half. The stale figures and the silence both go. The "2017 – Present"
   promise for all of Singapore stays unmet, though: the All Towns chart now
   spans 2025–2026 only. A buyer who wants the Singapore-wide trend since 2017
   still cannot get it, and is now told so. This was not a problem you already
   believed you had; it is new to you.
2. The problem is in the system, and the repair sits there: the route sorts
   newest first and reports `partial`, `oldestMonth` and `newestMonth`. A
   notice on the screen alone would only hide the problem. The screen half is
   right to exist, but only to say what the system sent.
3. It could break 4, Consistency and Standards. The chart title now says
   "2025–2026 Resale Price Trend" while the button beside it still reads
   "2017–2026", the same kind of mismatch KS raised about "Select Year: 2026".
   It could also break 8: the notice is another block above the median,
   which already starts about 1,100 px down on a phone (SS finding 4).
4. The smallest alternative is `sort=month desc` in the route plus the
   existing "Based on N" line naming the real months, with no separate
   notice. Two things were built that the finding does not need:
   - fetching pages three at a time;
   - extending the cap to All Towns with one flat type.

   Both change behaviour nobody reported. Leave them out, or test that view
   on the live address first.
5. To check it on the live address:
   - Choose "All Towns across Singapore", clear the search, choose All Flat
     Types. The newest sale in the list must be the latest month
     (September 2026).
   - The summary must name the number of sales and the months they cover.
   - Open /api/hdb: `partial` must be `true` and `newestMonth` `2026-09`.

**My decision (one line to the agent):** Build repair 1: newest-first sort and coverage fields in /api/hdb, the coverage notice on the screen, and rename the chart's "2017–2026" button to "Yearly"; no parallel page fetching and no cap for All Towns with one flat type. Change nothing else.

Turned down: parallel fetching and the flat-type cap (nobody reported them); the smallest alternative without a notice (too easy to miss). Commit f0ece71.

---

## Repair 2: the headline median mixes nine years

**Finding (SS, finding 2).**
- Where: Explore Prices, KEY SUMMARY INFORMATION, default TAMPINES • 4 ROOM.
- What they did, what they saw: "Median Resale Price" $535,000, "Based on 6970
  recorded transactions (2017 – Present)"; the chart below shows the 2026
  median as $668,000.
- Heuristic: 2, Match Between the System and the Real World.
- Screen or system: screen.
- Severity: 3, frequency. It is the first number every visitor sees.
- Repair: the headline median describes recent sales by default, and says
  which period it covers.

**Evidence:** 1 groupmate (SS); reproduced ($535,044 against $668,000).

**Repair I propose:** the headline median uses the last 12 months and names
them; the full-period median sits beneath it.

**Arguments**
1. It solves the finding: the headline now reads as a current price
   ($663,000, close to the chart's $668,000).
2. The problem is in the screen, and so is the repair: the screen has each
   sale's month.
3. It breaks 4, Consistency and Standards. The median card now covers 12
   months, but the three cards beside it still cover nine years:
   - Transactions: 6,974;
   - Highest: $928,000;
   - Lowest: $250,000, a 2017-era sale.

   A buyer reading across the row compares figures from different periods
   without being told.
4. Smallest alternative that keeps the row honest: apply the same 12-month
   window to all four cards and name the window once in the summary heading.
   Cheaper still, but short of SS's repair: keep the nine-year median and
   only label its period. That does not make it describe recent sales.
5. To check it on the live address: open it fresh on Tampines 4 Room. The
   headline median must be close to the chart's latest-year median, the
   period must be named, and every card in the row must say which period it
   covers.

**My decision (one line to the agent):** Build repair 2: with all years selected, all four summary cards use the last 12 months, named once in the summary line, with the full-period median beneath the headline. Change nothing else.

Turned down: switching only the median card (the row would mix periods); labelling the nine-year median only (does not meet SS's "recent sales by default"). Commit 638ecad.

---

## Repair 3: "Midpoint valuation for selected flats"

**Finding (KS, finding 1).**
- Where: Key Summary Information.
- What they did, what they saw: Tampines, 4 Room, All Years; Median Resale
  Price $535,000 described as "Midpoint valuation for selected flats". A
  median resale price and a valuation are not the same thing.
- Heuristic: 2.
- Screen or system: screen.
- Severity: 3. Price is the main reason to use the site.
- Repair: change it to something like "Median recorded resale price for the
  selected filters."

**Evidence:** 1 groupmate (KS); reproduced.

**Repair I propose:** KS's wording, exactly.

**Arguments**
1. No strong reason to doubt it. It solves the problem KS described, not
   one you believed you had.
2. The problem is in the screen, and so is the repair.
3. It could weaken 8, slightly. The new label is longer and wraps to two
   lines on a phone.
4. Smaller alternative: "Median of recorded sales". The same kind of wording
   survives on the Lowest Price card ("Most accessible entry sale"), but
   that is outside this finding.
5. To check it on the live address: read the text under Median Resale Price.

**My decision (one line to the agent):** Build repair 3 as proposed: KS's wording. Change nothing else.

Turned down: "Median of recorded sales". KS's own wording is clearer. Commit 602e9c4.

---

## Repair 4: opens on Tampines 4 Room under "Every" transaction

**Finding (ST, finding 1).**
- Where: the page heading and summary.
- What they did, what they saw: the title reads "Every resale flat
  transaction recorded from January 2017…", yet the page silently opens on
  TAMPINES + 4 ROOM. The $535,000 median and 6,970 transactions are Tampines
  4-room only.
- Heuristic: 2 (or 1).
- Screen or system: screen.
- Severity: 3, impact. A visitor can take Tampines figures as Singapore-wide.
- Repair: none given.

**Evidence:** 1 groupmate (ST); reproduced.

**Repair I propose:** the heading no longer says "every", and the page says
which filter is on.

**Arguments**
1. It solves the finding only if the visitor sees the filter where they read
   the number. The "Now showing" line sits under the page heading, far above
   the median on a phone. The filter in the summary heading is what actually
   answers ST.
2. The problem is in the screen, and so is the repair. Opening on All Towns
   instead would land every visitor on the capped view, so the fix belongs in
   the labels, not the default.
3. It breaks 4, Consistency and Standards. The labels now say "Tampines · 4
   Room" in title case, while the dropdown, the flat-type buttons and the list
   still say "TAMPINES" and "4 ROOM". It could also break 8: one more line at
   the top of the phone view.
4. Smallest alternative: rewrite the heading sentence and put the active
   filter in the summary heading, next to the numbers. Drop the "Now showing"
   line, and use the same capitals as the dropdown.
5. To check it on the live address: open it fresh. Without scrolling past
   the summary, you should be able to tell that the figures are Tampines
   4 Room only, and the word "every" should appear nowhere.

**My decision (one line to the agent):** Build repair 4: rewrite the heading sentence without "every" and put the active filter in the summary heading, in the dropdowns' wording; no "Now showing" line. Change nothing else.

Turned down: the extra "Now showing" line under the heading (far from the numbers on a phone, and it adds height). Commit 3241fa7, plus follow-up 3f68195 for the same "Every" promise in the navbar tagline, found in the before-screenshots.

---

## Repair 5: "0 matching transactions" while loading

**Finding (ST, finding 2; my finding 1).**
- Where: Multi-Function Search counter, on page load.
- What they did, what they saw: right after the page opens, the counter says
  "0 matching transactions" while a message below says "Loading live HDB
  resale flat transaction data…". A few seconds later it changes to 6,970.
- Heuristic: 1.
- Screen or system: screen.
- Severity: 2 (ST), 3 (me). Arbiter: [N].
- Repair: none given by ST. Mine was a submit button that says "Loading
  transactions…".

**Evidence:** 1 groupmate (ST); reproduced.

**Repair I propose:** the counter says "Loading transactions…" until the data
arrives.

**Arguments**
1. It solves ST's problem, not the one you believed you had. There is no
   submit button to disable, so your own repair does not apply to this page.
2. The problem is in the screen, and so is the repair.
3. No heuristic it plausibly breaks. The status is already shown lower down.
   No strong reason to doubt it.
4. It is already the smallest change: one condition on the counter.
5. To check it on the live address: reload and read the counter within the
   first second; then switch town and read it again. It must never show 0
   while the loading message is on screen.

**My decision (one line to the agent):** Build repair 5 as proposed. Change nothing else.

No alternative offered. Commit 736b5c2.

---

## Repair 6: the sort control appears three times

**Finding (ST 3, KS 3, SS 3).**
- Where: the filter panel ("SORT TRANSACTIONS BY"), above the list ("Sort
  by:") and the QUICK SORT row.
- What they did, what they saw: three controls for one choice, with labels
  that don't match: "(Cheapest First)", "(Cheapest)", "Lowest Price". It is
  unclear which one is in charge.
- Heuristic: 4 (ST, SS), 8 (KS).
- Screen or system: screen.
- Severity: 2, from all three.
- Repair: keep one main sorting control, and use the Quick Sort buttons as
  shortcuts that visibly update it (KS); each choice has one control, or
  controls that mean the same thing always show the same value (SS).

**Evidence:** 3 groupmates; reproduced.

**Repair I propose:** remove the filter panel's menu, give the remaining menu
the Quick Sort names, and have Quick Sort update it.

**Arguments**
1. It solves the finding. There are still two controls (the menu and the
   Quick Sort row), but that is what KS's and SS's repairs allow: the
   shortcuts now show the same value as the menu.
2. The problem is in the screen, and so is the repair.
3. It could break 6, Recognition Rather Than Recall. The shorter names drop
   the explanations the old labels carried: "Longest Lease" used to add
   "(Newest)", "Most Recent" used to say "Month First". It could also break
   7: on a phone, sorting now lives below the chart instead of beside the
   filters.
4. Smallest alternative: keep the filter-panel menu and delete the one above
   the list. Or keep both menus and only make all labels identical. The
   first is smaller than what was built.
5. To check it on the live address:
   - Count the sort controls: there should be one menu.
   - Click Quick Sort "Lowest Price": the menu must show "Lowest Price" and
     the list must start with the cheapest flat.

**My decision (one line to the agent):** Build repair 6 as proposed: one Sort by menu above the list, with the Quick Sort names, updated by Quick Sort. Change nothing else.

Turned down: keeping the filter-panel menu instead. The menu above the list sits next to the Quick Sort buttons it has to agree with. Commit 5030868.

---

## Repair 7: "Select Year: 2026" while 2017–2026 is active

**Finding (KS finding 2; SS finding 3).**
- Where: the Resale Price Trend chart.
- What they did, what they saw: the 2017–2026 view was selected, but the
  control on the right said "Select Year: 2026" (KS). SS also noted the year
  is chosen in two places: "TRANSACTION YEAR" in the filters and "Select
  Year:" beside the chart.
- Heuristic: 4.
- Screen or system: screen.
- Severity: 2, from both.
- Repair: only show the year selector when the user chooses a single year
  (KS).

**Evidence:** 2 groupmates; reproduced.

**Repair I propose:** the chart's picker reads "Pick a year" unless the
single-year view is active.

**Arguments**
1. It solves KS's problem, but not SS's. There are still two year controls
   (the filter's Transaction Year and the chart's single year), and they can
   disagree: filter set to 2024, chart set to 2025.
2. The problem is in the screen, and so is the repair.
3. It could break 6, slightly. A disabled "Pick a year" option is less
   obvious than a year.
4. Smallest alternative that answers both: hide the chart's picker whenever
   the filter already sets a year. Or leave it as built and accept that SS's
   half stays open.
5. To check it on the live address:
   - In the 2017–2026 view, the picker must show no year.
   - Pick 2025: the title must change to Year 2025 and the picker must show
     2025.
   - Click 2017–2026: the picker must go back to "Pick a year".

**My decision (one line to the agent):** Build repair 7 as proposed. Change nothing else.

Turned down: also hiding the picker when the Transaction Year filter sets a year. SS's point that the year can be set in two places is left open, and my reply to him says so. Commit bb3a11c.

---

## Repair 8: All Towns says "no sales" for a year it has not loaded

Added after the seven repairs were live. I asked the agent "is the product
better now after the revision?", and its check of the live address found
this problem. I then ran the sceptical-reviewer prompt on it.

**Finding (SS, finding 1, as it still stood after repair 1).**
- Where: Explore Prices, TOWN / LOCATION "All Towns across Singapore",
  TRANSACTION YEAR set to a year before the loaded period (e.g. 2019).
- What happens: the coverage notice disappears and the page says "No
  official resale transactions recorded in the data.gov.sg dataset match
  your query" and "No HDB resale transactions were found matching your
  selected criteria", which is false.
- Heuristic: 1 (SS's finding); the false message is also 9.
- Screen or system: screen. The system already sends oldestMonth and
  newestMonth; the screen ignores them when a filter returns nothing.
- Severity: 4 (SS's finding 1).
- Repair (SS): "the page says plainly which period and how many sales they
  are based on". After repair 1 that is still false in this case.

**Evidence:** found by the agent on the live address on 29 September 2026;
no groupmate raised this case.

**Repair I propose:** the page never says there are no sales when the year
is only outside what was loaded, and names what was loaded instead.

**Arguments**
1. It is a gap in repair 1, so it serves SS's finding, but it was found by
   the agent right after I had marked heuristic 9 as my product's worst.
   That is the moment to suspect confirmation. The evidence holds anyway:
   the message is false, and that was checked on the live address.
2. The problem is on the screen, and so is the repair. A system
   alternative (the route fetching the chosen year for All Towns) would
   show 2019 for real, but it is a larger change to a route that is already
   slow (about 16 seconds per page).
3. It could break 8: ST already found the no-results screen saying "No
   results found." four times. The repair must replace those messages in
   this case, not add another.
4. Smallest alternative: disable out-of-range years in the Transaction Year
   menu (prevention, heuristic 5). But a year can also be set by typing
   "2019" in the search, or by switching from a town to All Towns with 2019
   set, so an explanation is needed anyway.
5. To check it on the live address:
   - All Towns + 2019 must name the loaded period, say how to see 2019, and
     never claim there are no sales.
   - Tampines + 2019 must still show 2019.
   - A search for "zzzz" must still say "No results found."

**My decision (one line to the agent):** Build it as "explain in place":
when All Towns is capped and the chosen year is outside the loaded months,
replace the no-results messages with one message naming the loaded period,
with a way back to all loaded months. Change nothing else.

Turned down: also disabling years in the menu (it doesn't cover the search
and town-switch paths); fetching the year in the route (a larger, slower
change). Commit c429abc.

---

## Blind-arbiter exchanges

[PASTE EACH BLIND-ARBITER PROMPT AND ITS ANSWER HERE: the loading counter
(me 3, ST 2) and the empty-versus-failure finding (me 3, SS 1).]
