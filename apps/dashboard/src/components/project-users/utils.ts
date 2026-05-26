import type { ProjectUserPermissionValue } from "@convex/schema/helpers";

export const PROJECT_PERMISSION_LABELS: Record<
  ProjectUserPermissionValue,
  string
> = {
  "project.update": "Update project",
  "project.delete": "Delete project",
  "flag.create": "Create flags",
  "flag.update": "Update flags",
  "flag.delete": "Delete flags",
  "api_key.create": "Create API keys",
  "api_key.update": "Update API keys",
  "api_key.delete": "Delete API keys",
  "environment.create": "Create environments",
  "environment.update": "Update environments",
  "environment.delete": "Delete environments",
  "member.add": "Add members",
  "member.update": "Update members",
  "member.remove": "Remove members",
};
