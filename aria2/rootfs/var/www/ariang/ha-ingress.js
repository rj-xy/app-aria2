// Points AriaNg at aria2 through the HA ingress path it was loaded from, on
// every page load, so it works from any HA address (local, remote, the
// companion app).
//
// AriaNg uses its saved settings as they are and only falls back to its
// defaults when nothing is saved, so this script never saves a partial set:
// - first visit: AriaNg's defaults read window.haIngressRpc (the Dockerfile
//   patches them), so AriaNg saves a full set that already fits
// - later visits: only the connection fields of the saved set are updated
(function () {
  var https = location.protocol === 'https:';
  var rpc = {
    protocol: https ? 'https' : 'http',
    port: location.port || (https ? '443' : '80'),
    iface: location.pathname.replace(/[^/]*$/, '').replace(/^\//, '') + 'jsonrpc'
  };
  window.haIngressRpc = rpc;

  var key = 'AriaNg.Options';
  var options = null;
  try {
    options = JSON.parse(localStorage.getItem(key));
  } catch (e) {
    options = null;
  }
  if (!options) {
    return;
  }
  // A partial set saved by app 1.0.0 breaks AriaNg: drop it, defaults take over
  if (!options.title || !options.theme) {
    localStorage.removeItem(key);
    return;
  }
  options.protocol = rpc.protocol;
  options.rpcHost = location.hostname;
  options.rpcPort = rpc.port;
  options.rpcInterface = rpc.iface;
  options.secret = '';
  localStorage.setItem(key, JSON.stringify(options));
})();
