import { SwitchboardClient } from "@switchboard/js";

const API_KEY = import.meta.env.VITE_SB_API_KEY;
const HOST = import.meta.env.VITE_SB_HOST ?? "http://127.0.0.1:3210";

const client = new SwitchboardClient({
  apiKey: API_KEY,
  url: HOST,
  onError: (err) => log(`error: ${err.message}`),
});

const flagKeys = ["ui_v2", "max_items", "banner"] as const;

const tbody = document.getElementById("flags")!;
const logEl = document.getElementById("log")!;
const statusEl = document.getElementById("status")!;

client.onConnectionChange((state) => {
  if (state.isWebSocketConnected) {
    statusEl.textContent = "connected";
    statusEl.className =
      "text-xs px-2 py-0.5 border border-green-600 text-green-600";
    log("connected");
  } else if (state.hasEverConnected) {
    statusEl.textContent = `reconnecting (${state.connectionRetries})`;
    statusEl.className =
      "text-xs px-2 py-0.5 border border-yellow-600 text-yellow-600";
    log("disconnected — reconnecting...");
  } else {
    statusEl.textContent =
      state.connectionRetries > 0
        ? `retrying (${state.connectionRetries})`
        : "connecting...";
    statusEl.className =
      "text-xs px-2 py-0.5 border border-muted-foreground text-muted-foreground";
  }
});

function log(msg: string) {
  const div = document.createElement("div");
  div.className = "py-0.5 border-b border-border last:border-b-0";
  const time = new Date().toLocaleTimeString();
  div.textContent = `[${time}] ${msg}`;
  logEl.prepend(div);
}

function renderRow<T>(name: string, enabled: boolean, payload: T) {
  let row = document.getElementById(`flag-${name}`);
  if (!row) {
    row = document.createElement("tr");
    row.id = `flag-${name}`;
    row.className = "border-b border-border";
    tbody.appendChild(row);
  }
  row.innerHTML = /* html */ `
    <td class="p-2.5">${name}</td>
    <td class="p-2.5"><span class="border border-border px-2 py-0.5 text-xs">${enabled ? "on" : "off"}</span></td>
    <td class="p-2.5"><code class="bg-muted px-1.5 py-0.5 text-xs">${String(payload ?? "undefined")}</code></td>
    <td class="p-2.5"><span class="border border-border px-2 py-0.5 text-xs">${typeof payload}</span></td>
  `;
}

for (const name of flagKeys) {
  renderRow(name, false, "...");
  client.on(name, (flag) => {
    log(`${name} → enabled=${flag.enabled}, payload=${String(flag.payload)}`);
    renderRow(name, flag.enabled, flag.payload);
  });
}

log("waiting for flag updates");