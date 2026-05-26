import type { EmailTemplateTypes } from "./types";

export const replacePlaceholders = (
  rawHTML: string,
  emailReplacers: Record<string, unknown>,
) => {
  let filledHTML = rawHTML;
  Object.entries(emailReplacers).forEach(([placeholder, value]) => {
    filledHTML = filledHTML.replace(
      new RegExp(`{{${placeholder}}}`, "g"),
      String(value),
    );
  });
  return filledHTML;
};

const TemplatesMap: Record<
  EmailTemplateTypes,
  () => Promise<{ BODY: string; SUBJECT: string }>
> = {
  invite: () => import("./templates/invite"),
  welcome: () => import("./templates/welcome"),
  forgot_password: () => import("./templates/forgot_password"),
  account_locked: () => import("./templates/account_locked"),
  account_unlocked: () => import("./templates/account_unlocked"),
  password_changed: () => import("./templates/password_changed"),
  permissions_changed: () => import("./templates/permissions_changed"),
  project_member_added: () => import("./templates/project_member_added"),
  project_member_removed: () => import("./templates/project_member_removed"),
  project_member_permissions_changed: () =>
    import("./templates/project_member_permissions_changed"),
};
export const getRawTemplate = async (key: EmailTemplateTypes) => {
  return await TemplatesMap[key]();
};
