// Torrents off: refuses aria2 JSON-RPC requests that would add a torrent
// (aria2.addTorrent, a magnet link in aria2.addUri, or either one inside
// system.multicall) with an error AriaNg shows, and hands every other request
// to aria2 (the @aria2 location). A batch with one such call is refused whole.

const MESSAGE = "Torrents are off in the app's options (Settings > Apps > aria2 > Configuration)";

function isObject(value) {
    return value !== null && typeof value === 'object';
}

function addsTorrent(method, params) {
    let args = Array.isArray(params) ? params : [];
    if (typeof args[0] === 'string' && args[0].startsWith('token:')) {
        args = args.slice(1);
    }
    switch (method) {
    case 'aria2.addTorrent':
        return true;
    case 'aria2.addUri':
        return Array.isArray(args[0])
            && args[0].some((uri) => typeof uri === 'string' && /^\s*magnet:/i.test(uri));
    case 'system.multicall':
        return Array.isArray(args[0])
            && args[0].some((call) => isObject(call) && addsTorrent(call.methodName, call.params));
    default:
        return false;
    }
}

function filter(r) {
    // GET calls and WebSocket would get past the check
    if (r.method !== 'POST') {
        r.return(405, 'Only POST while torrents are off\n');
        return;
    }
    let body;
    try {
        body = JSON.parse(r.requestText);
    } catch (e) {
        // Not JSON: aria2 answers that itself
        r.internalRedirect('@aria2');
        return;
    }
    const calls = Array.isArray(body) ? body : [body];
    if (!calls.some((call) => isObject(call) && addsTorrent(call.method, call.params))) {
        r.internalRedirect('@aria2');
        return;
    }
    const refuse = (call) => ({
        jsonrpc: '2.0',
        id: isObject(call) ? call.id : null,
        error: {code: 1, message: MESSAGE},
    });
    r.headersOut['Content-Type'] = 'application/json-rpc';
    r.return(400, JSON.stringify(Array.isArray(body) ? calls.map(refuse) : refuse(body)));
}

export default {filter};
