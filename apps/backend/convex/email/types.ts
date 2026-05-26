export type EmailTemplateTypes =
  | "invite"
  | "welcome"
  | "forgot_password"
  | "account_locked"
  | "account_unlocked"
  | "password_changed"
  | "permissions_changed"
  | "project_member_added"
  | "project_member_removed"
  | "project_member_permissions_changed";

interface TemplateVariables<T extends EmailTemplateTypes> {
  template: T;
  variables?: Record<string, unknown>;
}

interface InviteVariables extends TemplateVariables<"invite"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
    url: string;
    invitedBy: string;
    expiresIn: string;
  };
}

interface WelcomeVariables extends TemplateVariables<"welcome"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
    url: string;
  };
}

interface ForgotPasswordVariables extends TemplateVariables<"forgot_password"> {
  variables: {
    platformName: string;
    orgName: string;
    email: string;
    url: string;
    expiresIn: string;
  };
}

interface AccountLockedVariables extends TemplateVariables<"account_locked"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
  };
}

interface AccountUnlockedVariables extends TemplateVariables<"account_unlocked"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
    url: string;
  };
}

interface PasswordChangedVariables extends TemplateVariables<"password_changed"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
  };
}

interface PermissionsChangedVariables extends TemplateVariables<"permissions_changed"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
  };
}

interface ProjectMemberAddedVariables extends TemplateVariables<"project_member_added"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
    projectName: string;
    addedBy: string;
  };
}

interface ProjectMemberRemovedVariables extends TemplateVariables<"project_member_removed"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
    projectName: string;
  };
}

interface ProjectMemberPermissionsChangedVariables extends TemplateVariables<"project_member_permissions_changed"> {
  variables: {
    email: string;
    platformName: string;
    orgName: string;
    projectName: string;
  };
}

export type Email<T extends EmailTemplateTypes> = Extract<
  | InviteVariables
  | WelcomeVariables
  | ForgotPasswordVariables
  | AccountLockedVariables
  | AccountUnlockedVariables
  | PasswordChangedVariables
  | PermissionsChangedVariables
  | ProjectMemberAddedVariables
  | ProjectMemberRemovedVariables
  | ProjectMemberPermissionsChangedVariables,
  { template: T }
>;
