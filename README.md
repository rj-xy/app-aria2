# aria2 for Home Assistant

A Home Assistant app with [aria2](https://aria2.github.io/) and the
[AriaNg](https://github.com/mayswind/AriaNg) web UI: downloads links and
torrents to a folder of your choice, from the Home Assistant sidebar.

[![Add the repository to your Home Assistant][repo-badge]][repo-add]

Or add it by hand: **Settings** → **Apps** → **App store** → ⋮ →
**Repositories** → `https://github.com/rj-xy/app-aria2`.

| App | What it does |
| --- | --- |
| [aria2](aria2/) | Links (HTTP, HTTPS, FTP) and torrents, AriaNg in the sidebar, seeding and upload limits. Docs: [DOCS.md](aria2/DOCS.md) |

Architectures: `aarch64` (Raspberry Pi 4 and 5) and `amd64`.

## Releases

GitHub Actions ([build.yaml](.github/workflows/build.yaml)) builds both images on
every push and pull request. Publishing a GitHub release pushes them to
`ghcr.io/rj-xy/app-aria2/<arch>:<version>`. The release tag must match
`version` in [aria2/config.yaml](aria2/config.yaml); Home Assistant offers the
update once the images are up.

1. Raise `version` in `aria2/config.yaml` and add the changes to `aria2/CHANGELOG.md`.
2. Push to `main`.
3. Publish a release tagged `v<version>`.

## Licence

MIT for this repository ([LICENSE.md](LICENSE.md)). aria2 is GPL-2.0-or-later
and AriaNg is MIT; both come from their own projects at build time.

[repo-badge]: https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg
[repo-add]: https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Frj-xy%2Fapp-aria2
