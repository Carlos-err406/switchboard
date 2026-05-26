import { HeaderUser } from "#/integrations/convex/auth/header-user.tsx";
import { env } from "#env";
import { Switch } from "@switchboard/ui";
import { Link } from "@tanstack/react-router";
import { Authenticated, useQuery } from "convex/react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { SearchInput } from "./search-input";
import { api } from "@convex/_generated/api";

export const Header: FC = () => {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setStatus((s) => !s), 10_000);
    return () => clearInterval(interval);
  });
  const user = useQuery(api.users.queries.currentUserQuery);
  return (
    <div className="flex items-center justify-between h-16 px-4">
      <a
        href={env.VITE_LANDING_URL}
        target="_blank"
        className="flex items-center gap-2"
      >
        <Switch checked={status} /> Switchboard
      </a>
      <div className="flex items-center gap-4">
        <Authenticated>
          <SearchInput />
          <Link to="/projects">Projects</Link>
          <Link
            disabled={!user?.permissions.includes("users.list")}
            to="/users"
          >
            Users
          </Link>
          <Link disabled={!user?.permissions.includes("logs.list")} to="/logs">
            Logs
          </Link>
        </Authenticated>
        <HeaderUser />
      </div>
    </div>
  );
};
