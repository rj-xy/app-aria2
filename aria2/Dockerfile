ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.24
FROM ${BUILD_FROM}

# aria2 is Alpine's own package (1.37.0, with BitTorrent, Metalink and HTTPS).
# AriaNg is the web UI; its release zip is checked against the GitHub digest.
ARG ARIANG_VERSION=1.3.15
ARG ARIANG_SHA256=d2317e441966ad31f1e342cb6a6cc1c51808fb0a10cf6e39cb30b0517b3e7823
RUN apk add --no-cache aria2 ca-certificates nginx \
    && aria2c --version | grep -q 'Enabled Features:.*BitTorrent' \
    && wget -q -O /tmp/ariang.zip "https://github.com/mayswind/AriaNg/releases/download/${ARIANG_VERSION}/AriaNg-${ARIANG_VERSION}.zip" \
    && echo "${ARIANG_SHA256}  /tmp/ariang.zip" | sha256sum -c - \
    && mkdir -p /var/www/ariang \
    && unzip -q /tmp/ariang.zip -d /var/www/ariang \
    && rm /tmp/ariang.zip \
    && sed -i 's#<head>#<head><script src="ha-ingress.js"></script>#' /var/www/ariang/index.html \
    && grep -q 'ha-ingress.js' /var/www/ariang/index.html \
    && sed -i 's#rpcHost:"",rpcPort:"6800",rpcInterface:"jsonrpc",protocol:"http"#rpcHost:"",rpcPort:window.haIngressRpc.port,rpcInterface:window.haIngressRpc.iface,protocol:window.haIngressRpc.protocol#' /var/www/ariang/js/aria-ng-*.min.js \
    && grep -q 'window.haIngressRpc.iface' /var/www/ariang/js/aria-ng-*.min.js

COPY rootfs/ /
RUN chmod +x /run.sh
CMD ["/run.sh"]

# Build arguments (set by .github/workflows/build.yaml)
ARG BUILD_ARCH
ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

LABEL \
    io.hass.name="${BUILD_NAME}" \
    io.hass.description="${BUILD_DESCRIPTION}" \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.type="addon" \
    io.hass.version=${BUILD_VERSION} \
    maintainer="RJ-XY" \
    org.opencontainers.image.title="${BUILD_NAME}" \
    org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
    org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/aria2/DOCS.md" \
    org.opencontainers.image.created=${BUILD_DATE} \
    org.opencontainers.image.revision=${BUILD_REF} \
    org.opencontainers.image.version=${BUILD_VERSION}
