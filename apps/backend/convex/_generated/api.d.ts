/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as api_keys_helpers from "../api_keys/helpers.js";
import type * as api_keys_mutations from "../api_keys/mutations.js";
import type * as api_keys_queries from "../api_keys/queries.js";
import type * as audit_logs_helpers from "../audit_logs/helpers.js";
import type * as audit_logs_mutations from "../audit_logs/mutations.js";
import type * as audit_logs_queries from "../audit_logs/queries.js";
import type * as auth from "../auth.js";
import type * as email_actions from "../email/actions.js";
import type * as email_helpers from "../email/helpers.js";
import type * as email_send from "../email/send.js";
import type * as email_templates_account_locked from "../email/templates/account_locked.js";
import type * as email_templates_account_unlocked from "../email/templates/account_unlocked.js";
import type * as email_templates_forgot_password from "../email/templates/forgot_password.js";
import type * as email_templates_helpers from "../email/templates/helpers.js";
import type * as email_templates_invite from "../email/templates/invite.js";
import type * as email_templates_password_changed from "../email/templates/password_changed.js";
import type * as email_templates_permissions_changed from "../email/templates/permissions_changed.js";
import type * as email_templates_welcome from "../email/templates/welcome.js";
import type * as email_types from "../email/types.js";
import type * as env from "../env.js";
import type * as environments_helpers from "../environments/helpers.js";
import type * as environments_mutations from "../environments/mutations.js";
import type * as environments_queries from "../environments/queries.js";
import type * as errors_helpers from "../errors/helpers.js";
import type * as errors_index from "../errors/index.js";
import type * as flags_helpers from "../flags/helpers.js";
import type * as flags_mutations from "../flags/mutations.js";
import type * as flags_queries from "../flags/queries.js";
import type * as global from "../global.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as invites_helpers from "../invites/helpers.js";
import type * as invites_mutations from "../invites/mutations.js";
import type * as invites_queries from "../invites/queries.js";
import type * as lib_functions from "../lib/functions.js";
import type * as password_resets_actions from "../password_resets/actions.js";
import type * as password_resets_helpers from "../password_resets/helpers.js";
import type * as password_resets_mutations from "../password_resets/mutations.js";
import type * as password_resets_queries from "../password_resets/queries.js";
import type * as project_users_helpers from "../project_users/helpers.js";
import type * as project_users_queries from "../project_users/queries.js";
import type * as projects_helpers from "../projects/helpers.js";
import type * as projects_mutations from "../projects/mutations.js";
import type * as projects_queries from "../projects/queries.js";
import type * as schema_helpers from "../schema/helpers.js";
import type * as schema_tables from "../schema/tables.js";
import type * as sdk_queries from "../sdk/queries.js";
import type * as users_actions from "../users/actions.js";
import type * as users_helpers from "../users/helpers.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "api_keys/helpers": typeof api_keys_helpers;
  "api_keys/mutations": typeof api_keys_mutations;
  "api_keys/queries": typeof api_keys_queries;
  "audit_logs/helpers": typeof audit_logs_helpers;
  "audit_logs/mutations": typeof audit_logs_mutations;
  "audit_logs/queries": typeof audit_logs_queries;
  auth: typeof auth;
  "email/actions": typeof email_actions;
  "email/helpers": typeof email_helpers;
  "email/send": typeof email_send;
  "email/templates/account_locked": typeof email_templates_account_locked;
  "email/templates/account_unlocked": typeof email_templates_account_unlocked;
  "email/templates/forgot_password": typeof email_templates_forgot_password;
  "email/templates/helpers": typeof email_templates_helpers;
  "email/templates/invite": typeof email_templates_invite;
  "email/templates/password_changed": typeof email_templates_password_changed;
  "email/templates/permissions_changed": typeof email_templates_permissions_changed;
  "email/templates/welcome": typeof email_templates_welcome;
  "email/types": typeof email_types;
  env: typeof env;
  "environments/helpers": typeof environments_helpers;
  "environments/mutations": typeof environments_mutations;
  "environments/queries": typeof environments_queries;
  "errors/helpers": typeof errors_helpers;
  "errors/index": typeof errors_index;
  "flags/helpers": typeof flags_helpers;
  "flags/mutations": typeof flags_mutations;
  "flags/queries": typeof flags_queries;
  global: typeof global;
  helpers: typeof helpers;
  http: typeof http;
  "invites/helpers": typeof invites_helpers;
  "invites/mutations": typeof invites_mutations;
  "invites/queries": typeof invites_queries;
  "lib/functions": typeof lib_functions;
  "password_resets/actions": typeof password_resets_actions;
  "password_resets/helpers": typeof password_resets_helpers;
  "password_resets/mutations": typeof password_resets_mutations;
  "password_resets/queries": typeof password_resets_queries;
  "project_users/helpers": typeof project_users_helpers;
  "project_users/queries": typeof project_users_queries;
  "projects/helpers": typeof projects_helpers;
  "projects/mutations": typeof projects_mutations;
  "projects/queries": typeof projects_queries;
  "schema/helpers": typeof schema_helpers;
  "schema/tables": typeof schema_tables;
  "sdk/queries": typeof sdk_queries;
  "users/actions": typeof users_actions;
  "users/helpers": typeof users_helpers;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
