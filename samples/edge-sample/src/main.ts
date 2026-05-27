import { SwitchboardHttpClient } from "@switchboard/edge";

const API_KEY = process.env.SB_API_KEY!;
const HOST = process.env.SB_HOST ?? "http://127.0.0.1:3210";

const client = new SwitchboardHttpClient({
  apiKey: API_KEY,
  switchboardHost: HOST,
});

const flagKeys = ["ui_v2", "max_items", "banner"] as const;

async function run() {
  console.log(`@switchboard/edge sample`);
  console.log(`host: ${HOST}\n`);

  for (const name of flagKeys) {
    try {
      const flag = await client.getFlag(name);
      console.log(
        `  ${name.padEnd(16)} enabled=${String(flag.enabled).padEnd(8)} payload=${String(flag.payload ?? "undefined").padEnd(12)} type=${typeof flag.payload}`,
      );
    } catch (e) {
      console.error(`  ${name.padEnd(16)} error: ${(e as Error).message}`);
    }
  }
}

run();
