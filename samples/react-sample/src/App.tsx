import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@switchboard/ui/components/card";
import { useCallback, useState } from "react";
import { ConnectionStatus } from "./components/connection-status";
import { FlagRow } from "./components/flag-row";
import { Log, type LogEntry } from "./components/log";

function App() {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const log = useCallback((message: string) => {
    setEntries((prev) => [
      { time: new Date().toLocaleTimeString(), message },
      ...prev,
    ]);
  }, []);

  const onFlagUpdate = useCallback(
    (name: string, value: unknown) => {
      log(`${name} → ${String(value)}`);
    },
    [log],
  );

  return (
    <div className="max-w-2xl mx-auto p-8 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <a
                target="_blank"
                href="https://github.com/Carlos-err406/switchboard/tree/main/samples/react-sample"
              >
                @switchboard/react-sample
              </a>
            </CardTitle>
            <ConnectionStatus onLog={log} />
          </div>
          <CardDescription>
            Toggle flags in the dashboard — values update in realtime.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-foreground">
                <th className="text-left p-2.5 font-medium">Flag</th>
                <th className="text-left p-2.5 font-medium">Default</th>
                <th className="text-left p-2.5 font-medium">Value</th>
                <th className="text-left p-2.5 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              <FlagRow
                name="ui_v2"
                defaultValue={false}
                onUpdate={onFlagUpdate}
              />
              <FlagRow
                name="max_items"
                defaultValue={10}
                onUpdate={onFlagUpdate}
              />
              <FlagRow name="banner" onUpdate={onFlagUpdate} />
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Log entries={entries} />
    </div>
  );
}

export default App;
