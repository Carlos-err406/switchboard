import type { UserPermissionValue } from "@convex/schema/helpers";

export const PERMISSION_LABELS: Record<UserPermissionValue, string> = {
  "projects.create": "Create projects",
  "users.invite": "Invite users",
  "users.update": "Update users",
  "users.delete": "Delete users",
  "users.list": "View users",
  "logs.list": "View logs",
};
