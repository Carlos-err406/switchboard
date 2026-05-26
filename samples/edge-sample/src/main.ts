import { SwitchboardHttpClient } from "@switchboard/edge";

const API_KEY = process.env.SB_API_KEY!;
const HOST = process.env.SB_HOST ?? "http://127.0.0.1:3210";

const client = new SwitchboardHttpClient({
  apiKey: API_KEY,
  switchboardHost: HOST,
  onError: (err) => console.error(`[onError] ${err.message}`),
});

const flags = [
  { name: "ui_v2", defaultValue: false },
  { name: "max_items", defaultValue: 10 },
  { name: "banner", defaultValue: undefined },
] as const;

async function run() {
  console.log(`@switchboard/edge sample`);
  console.log(`host: ${HOST}\n`);

  for (const { name, defaultValue } of flags) {
    try {
      const value = await client.getFlag(name, defaultValue);
      console.log(
        `  ${name.padEnd(16)} default=${String(defaultValue ?? "undefined").padEnd(12)} value=${String(value ?? "undefined").padEnd(12)} type=${typeof value}`,
      );
    } catch (e) {
      console.error(`  ${name.padEnd(16)} error: ${(e as Error).message}`);
    }
  }
}

run();
