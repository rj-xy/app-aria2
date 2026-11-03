# Changelog

## 1.2.0

- Option to turn torrents off: magnet links and `.torrent` files are then
  refused with a message, and aria2 doesn't look for peers.
- Options for downloads at once, connections per download, a download speed
  limit and the log level.

## 1.1.0

- First public release.
- Torrents: magnet links and `.torrent` files, with seeding and upload limits.
- Options for the download folder, a storage check, seeding and upload limits.
- aria2 from Alpine's package (1.37.0), AriaNg 1.3.15.
- Images built by GitHub Actions for `aarch64` and `amd64`.

## 1.0.1

- AriaNg's buttons work again: the ingress script no longer saves a partial
  settings set (1.0.0 crashed AriaNg on start).

## 1.0.0

- First version, links only, as a local app.
