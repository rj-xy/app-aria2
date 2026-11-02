#!/bin/bash
# Starts aria2 (RPC on localhost only) and nginx (AriaNg and the RPC proxy for HA ingress).
set -euo pipefail

OPTIONS=/data/options.json
opt() { jq -r ".$1" "$OPTIONS"; }

DIR=$(opt download_dir)

# The mount point that holds a path: the longest entry in /proc/mounts it sits under
mount_of() {
    local path=$1 best=/ mp
    while read -r _ mp _; do
        mp=$(printf '%b' "$mp")
        [[ $mp == / ]] && continue
        if [[ $path == "$mp" || $path == "$mp"/* ]] && (( ${#mp} > ${#best} )); then
            best=$mp
        fi
    done < /proc/mounts
    echo "$best"
}

# With require_mount, refuse to start unless the folder is on network storage or a
# USB drive, so downloads can't fill the HA data disk when that storage is missing
if [[ $(opt require_mount) == true ]]; then
    mp=$(mount_of "$DIR")
    case $mp in
        / | /data | /media | /share)
            echo "🔴 $DIR is not on its own mount (network storage or a USB drive), only on $mp. Not starting."
            exit 1
            ;;
    esac
    echo "🟢 $DIR is on the mount $mp"
fi

mkdir -p "$DIR"
touch /data/aria2.session

echo "🌱 aria2 $(aria2c --version | head -n 1 | awk '{print $3}'), downloads to $DIR," \
    "seeding to ratio $(opt seed_ratio) or $(opt seed_time) min, upload limit $(opt max_upload)"

aria2c --conf-path=/etc/aria2/aria2.conf \
    --dir="$DIR" \
    --seed-ratio="$(opt seed_ratio)" \
    --seed-time="$(opt seed_time)" \
    --max-overall-upload-limit="$(opt max_upload)" &
nginx -g 'daemon off;' &

# If either one exits, stop the app so the watchdog restarts it
wait -n
echo "🔴 aria2 or nginx exited"
exit 1
