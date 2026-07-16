# DiscoSO launcher — resource path status

The upstream launcher pulled everything from `beta.freeso.org` (now dead). Here is
where each resource points for DiscoSO, and what still needs doing.

## Available (working)
- **The Sims Online** — `https://archive.org/download/tso-fileplanet/TSO_Installer_v1.1239.1.0.zip` (Internet Archive; the version the FreeSO client patches).
- **FreeSO client** — `https://tso.thedisco.zone/site/downloads/freeso-client.zip` (our pinned build, pre-set to connect to DiscoSO). `getZipUrl()` is forced to this.
- **Remesh / 3D models (RMS)** — built from this repo's `extras/fsolauncher-remeshes/` and hosted at `https://tso.thedisco.zone/launcher/remeshes.zip`; manifest at `/launcher/RemeshPackage`.
- **Trending lots** — `https://tso.thedisco.zone/launcher/TrendingLots`, refreshed every 2 min by `discoso-trending.timer` from the live city data (`/userapi/city/1/city.json`). Shows the live online count; the per-lot list is still empty (see below).
- **Blog** — `https://tso.thedisco.zone/launcher/Blog` (a DiscoSO news feed).
- **FreeSO / Simitone version info** — GitHub release APIs (still live).
- **Launcher self-update** — `https://tso.thedisco.zone/launcher/UpdateCheck` returns the current launcher version + installer `Location`. Bump the `Version` there (and rebuild) to push a launcher update; users are notified and sent to the download.

## Disabled + flagged (no source yet — revisit)
- **Trending lots list** — online count is live; the actual lot cards (name/owner/thumbnail) need an endpoint built from the server DB + lot thumbnails. Currently `lots: []`.
- **Scenarios** (login-screen GIFs) — no content source found; served as an empty manifest.
- **WS live socket** — needs a socket.io server; stubbed in the renderer so the UI loads. No global messages / live push.
- **Simitone** (The Sims 1 mode) — download source was on beta; tab hidden. GitHub release exists if we want to wire it up.

## Mac / Linux support
- **MacExtras** (native MonoGame/SDL libs so the client runs under Mono) — mirrored from `freeso.org/stuff/macextras.zip` to `https://tso.thedisco.zone/launcher/macextras.zip`. **Required for the Linux install** (`fso.js` pulls it on Linux/Mac).
- **Mono** — Linux/Arch install it from the distro (`apt install mono-complete` / `pacman -S mono`); macOS downloads the official `download.mono-project.com` pkg.
- **SDL2** — Linux/Arch from the distro (`libsdl2` on Debian; on Arch/CachyOS the system already provides it, incl. via `sdl2-compat`, at `/usr/lib/libSDL2-2.0.so.0` — detected, not reinstalled); macOS from the official libsdl-org dmg. Pacman installs use `-Sy` (no forced `-Syu` system upgrade).
