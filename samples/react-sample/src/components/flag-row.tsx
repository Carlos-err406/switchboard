import type { Flag } from "@switchboard/common";
import { payloadType } from "@switchboard/common";
import { useFlag } from "@switchboard/react";
import { Badge } from "@switchboard/ui/components/badge";
import { Flag as FlagIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export function FlagRow({
  name,
  onUpdate,
}: {
  name: string;
  onUpdate?: (name: string, flag: Flag) => void;
}) {
  const flag = useFlag(name);
  const prev = useRef(flag);

  useEffect(() => {
    if (prev.current !== flag && flag) {
      prev.current = flag;
      onUpdate?.(name, flag);
    }
  }, [flag, name, onUpdate]);

  return (
    <tr className="border-b">
      <td className="py-2 flex items-center gap-2">
        <FlagIcon className="size-3.5 text-muted-foreground" />
        {name}
      </td>
      <td className="py-2">
        <Badge variant="outline" className="px-1.5">
          {flag?.enabled ? "on" : "off"}
        </Badge>
      </td>
      <td>
        <code className="bg-muted px-1.5 py-0.5 text-xs">
          {String(flag?.payload ?? "undefined")}
        </code>
      </td>
      <td className="py-2">
        <Badge variant="outline" className="px-1.5">
          {payloadType(flag?.payload)}
        </Badge>
      </td>
    </tr>
  );
}
