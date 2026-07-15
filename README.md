# DiscoSO Launcher 🪩

The official launcher for **[DiscoSO](https://tso.thedisco.zone)** — a free, community-run revival of *The Sims Online*. It downloads the game and the client for you and connects you straight to the DiscoSO server. No files to hunt down, no server address to type. 🎉

👉 **To play:** create a free account at **[tso.thedisco.zone](https://tso.thedisco.zone)**, download the launcher, and move into Starlight Crater. 🏡

## About this fork

DiscoSO Launcher is a fork of the excellent **[FreeSO Launcher](https://github.com/ItsSim/fsolauncher)** by ItsSim and contributors, under the Mozilla Public License 2.0. FreeSO's own servers and resource hosts went offline at the end of 2024, so this fork:

- 🕹️ Connects to the **DiscoSO** server by default.
- 📦 Points the game-file and client downloads at working sources (the Internet Archive, and DiscoSO's own hosting).
- 🌐 Serves its launcher resources (remesh package, trending lots, blog, updates) from DiscoSO.

Every change we made is documented in **[DISCOSO-RESOURCES.md](./DISCOSO-RESOURCES.md)**, and the full diff against upstream is visible in this fork's commit history. All credit for the launcher itself belongs to the FreeSO Launcher authors. 💚

## Downloads

Grab the latest build (Windows and Linux) from **[tso.thedisco.zone](https://tso.thedisco.zone)**.

## Building from source

Requires the latest Node.js LTS.

1. Clone this repository and `cd app`.
2. `npm install`.
3. Run it with `npm run start`, or build it: `npm run buildwin` (Windows), `npm run builddeb` (Linux), or `npm run builddarwin` (macOS). Output lands in the `release/` folder.

## License

Mozilla Public License 2.0, the same as upstream. See [LICENSE.md](./LICENSE.md).
