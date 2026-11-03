# aria2

[aria2](https://aria2.github.io/) downloads links (HTTP, HTTPS, FTP) and
torrents (magnet links and `.torrent` files). [AriaNg](https://github.com/mayswind/AriaNg)
is its web UI, in the Home Assistant sidebar as **aria2**.

Source code and issues: [github.com/rj-xy/app-aria2](https://github.com/rj-xy/app-aria2).
The image is built from the [aria2 folder](https://github.com/rj-xy/app-aria2/tree/main/aria2)
([Dockerfile](https://github.com/rj-xy/app-aria2/blob/main/aria2/Dockerfile)) by
[GitHub Actions](https://github.com/rj-xy/app-aria2/actions/workflows/build.yaml).

## Install

1. Install the app, then set the **Download folder** on the **Configuration** tab.
2. Start it, and turn on **Show in sidebar** and **Watchdog**.
3. Open **aria2** in the sidebar.

## Use it

- **A link:** **+ New** → paste one or more links → **Start Now**. Per-download
  options (folder, file name, connections, checksum) are on the **Options** tab.
- **A magnet link:** **+ New** → paste it → **Start Now**. aria2 first fetches
  the torrent's details from peers, so a magnet needs peers that speak plain
  BitTorrent. aria2 can't reach browser peers (WebTorrent), and a magnet can't
  use web seeds, so a torrent seeded only by browsers or only over HTTP (many
  archive.org items) waits at 0 connections. Use its `.torrent` file instead.
- **A `.torrent` file:** **+ New** → the folder button next to the tabs →
  **Open Torrent File** → **Start Now**. aria2 keeps a copy named
  `<hash>.torrent` in the download folder, so the queue can resume after a restart.
- **A link that redirects to a CDN** (Hugging Face, GitHub releases) may be
  saved under the CDN's name: set the file name in **Options** → `out` first.
- **Checksum:** **Options** → `checksum` = `sha-256=<hex>` checks the finished file.

The queue survives restarts and is in the app's backups.

Removing a download in AriaNg keeps its files. Delete them with a file manager
(for example the File Explorer app or a network share).

## Options

| Option | Default | What it does |
| --- | --- | --- |
| `download_dir` | `/share/downloads` | Where downloads go. Under `/media` or `/share` |
| `require_mount` | `false` | Refuse to start unless that folder is on network storage or a USB drive, so a missing NAS can't fill the Home Assistant data disk |
| `concurrent_downloads` | `3` | Downloads running at the same time (1 to 16); the rest wait. Torrents that are only seeding don't count |
| `connections_per_download` | `4` | Connections one download may open to a server, to fetch a big file in parts (1 to 16) |
| `max_download` | `0` | Total download speed in bytes per second (`4M` = 32 Mbit/s, `0`: no limit) |
| `torrents` | `true` | Allow magnet links and `.torrent` files. See [Torrents off](#torrents-off) |
| `seed_ratio` | `1.0` | Stop seeding a finished torrent at this share ratio (`0`: no ratio limit) |
| `seed_time` | `4320` | Stop seeding after this many minutes (3 days). Whichever limit comes first wins |
| `max_upload` | `2M` | Total upload speed in bytes per second (`2M` = 16 Mbit/s, `0`: no limit) |
| `log_level` | `notice` | How much aria2 writes to the app's log: `debug`, `info`, `notice`, `warn` or `error` |

The seeding options and the upload limit only matter with `torrents` on.
Other settings are aria2's defaults plus a few in
[aria2.conf](https://github.com/rj-xy/app-aria2/blob/main/aria2/rootfs/etc/aria2/aria2.conf):
no file preallocation, parts of at least 20 MB, DHT on.

### Torrents off

With `torrents` off, the app downloads links only:

- Adding a magnet link or a `.torrent` file fails with "Torrents are off in
  the app's options".
- A link to a `.torrent` file downloads the file itself and doesn't start the torrent.
- aria2 has no way to find peers (no trackers, DHT or peer exchange), so
  torrents already in the queue stay at 0 connections. Remove them in AriaNg.

It's a switch, not a lock: anyone who can open the sidebar is a Home Assistant
admin and can turn it back on.

## Privacy and security

- **Torrents use your own internet address.** There is no VPN in this app:
  every peer in a swarm sees your public IP. Download only what you have the
  right to, or turn `torrents` off.
- No port is published, so aria2 only dials out to peers. That is enough to
  download and to upload to peers that accept connections.
- The web UI and aria2's RPC are only reachable through Home Assistant's
  ingress, which needs an admin login. aria2's RPC has no secret of its own
  (it logs a warning about that at start); it listens only inside the container.
- Anyone with the sidebar can choose another folder per download: anything
  the app sees (`/media`, `/share`, `/data`).

## Credits

[aria2](https://github.com/aria2/aria2) (GPL-2.0-or-later), Alpine Linux's
package. [AriaNg](https://github.com/mayswind/AriaNg) (MIT).
