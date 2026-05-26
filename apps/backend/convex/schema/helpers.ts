import { v } from "convex/values";

export const USER_PERMISSIONS = [
  "projects.create",
  "users.list",
  "users.invite",
  "users.delete",
  "users.update",
  "logs.list",
] as const;

export const PROJECT_USER_PERMISSIONS = [
  "project.update",
  "project.delete",
  "flag.create",
  "flag.update",
  "flag.delete",
  "api_key.create",
  "api_key.update",
  "api_key.delete",
  "environment.create",
  "environment.update",
  "environment.delete",
  "member.add",
  "member.remove",
] as const;

export const USER_ROLES = ["member", "admin"] as const;

export type UserPermissionValue = (typeof USER_PERMISSIONS)[number];

export type ProjectUserPermissionValue =
  (typeof PROJECT_USER_PERMISSIONS)[number];

export type UserRoleValue = (typeof USER_ROLES)[number];

export const userPermissionValues = v.array(
  v.union(...USER_PERMISSIONS.map(v.literal)),
);

export const projectUserPermissionValues = v.array(
  v.union(...PROJECT_USER_PERMISSIONS.map(v.literal)),
);

export const userRoleValues = v.union(...USER_ROLES.map(v.literal));
