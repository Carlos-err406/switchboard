import type { DetailedApiKey } from "#/lib/types/inferred.ts";
import { Badge } from "@switchboard/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@switchboard/ui/components/card";
import dayjs from "dayjs";
import { Key } from "lucide-react";
import type { FC } from "react";
import { ApiKeyToggle } from "./apikey-toggle";
import { DeleteApiKeyDialog } from "./delete-apikey-dialog";
import { RotateApiKeyDialog } from "./rotate-apikey-dialog";
import { UpdateApiKeyDialog } from "./update-apikey-dialog";

export const ApiKeyCard: FC<{ apiKey: DetailedApiKey }> = ({ apiKey }) => {
  const formatExpiresAt = () => {
    const { expiresAt } = apiKey;
    if (!expiresAt) return "Never";
    const expires = dayjs(expiresAt);
    if (expires.isBefore(dayjs())) return "Expired";
    return expires.fromNow(); // e.g. "in 3 days"
  };

  const formatLastUsed = () => {
    const { lastUsedAt } = apiKey;
    if (!lastUsedAt) return "Never";
    return dayjs(lastUsedAt).fromNow(); // e.g. "2 days ago"
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center w-full justify-between">
          <CardTitle className="flex items-center gap-2">
            <Key className="size-4" /> {apiKey.name}
          </CardTitle>
          <ApiKeyToggle apiKey={apiKey} />
        </div>
        <CardDescription>
          {dayjs(apiKey._creationTime).format("MMM DD, YYYY")}
          {apiKey.description && " · " + apiKey.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-1">
          <p className="text-center">{apiKey.keyPreview}</p>
        </div>

        <div className="flex justify-end flex-col gap-2">
          <Badge variant={"outline"}>Expires: {formatExpiresAt()}</Badge>
          <Badge variant={"outline"}>Last used: {formatLastUsed()}</Badge>
          <Badge variant={"outline"}>Created by: {apiKey.creatorEmail}</Badge>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <RotateApiKeyDialog apiKey={apiKey} />
        <UpdateApiKeyDialog apiKey={apiKey} />
        <DeleteApiKeyDialog apiKey={apiKey} />
      </CardFooter>
    </Card>
  );
};
