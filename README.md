# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/rmakoto11/makefun/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/rmakoto11/makefun/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

The best offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5: all 55 official trophies (1 platinum, 2 gold, 6 silver, 46 bronze) with their official names, descriptions and grades, a guide to each in our own words that cites its sources, a roadmap to the platinum, and every missable trophy flagged.

## What it does

- **Tracker:** a checklist of all 55 trophies, progress saved in the browser (localStorage), with export to a file and import back.
- **Filters:** by kind (story, missable, collectibles, activities, combat, exploration, money, online) and by grade, plus full-text search.
- **Spoiler-free mode:** hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the platinum:** five stages built from the official descriptions — story in order, strangers and partners, activities, collectibles and exploration, then combat, money and the 100% cleanup.
- **Missables:** every missable trophy listed with why it can be missed and when to do it.
- **Cited guides:** each trophy's guide names its sources — the official list on Exophase, PSNProfiles for PSN's progress targets, and our own advice from the official description, which says plainly where a place or step is not pinned down yet (the game released 2026-11-19; these guides were not checked in the game).

## Run it

Serve `app/` with any static server and open `index.html` in a desktop browser, with the network off — it loads nothing over the network:

```sh
node serve.ts
# open http://localhost:8080
```

Or build the entry output exactly as the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored make.fun library.

## Screenshots

`shots.json` lists the four screenshots in `screenshots/`, taken of this guide running in a desktop browser at 1280×800: the checklist with a trophy's guide open, the roadmap, the missables list, and the checklist with spoiler-free mode on.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
