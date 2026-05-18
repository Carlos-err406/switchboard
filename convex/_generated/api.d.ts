/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as errors_index from "../errors/index.js";
import type * as http from "../http.js";
import type * as infra_generateKeys from "../infra/generateKeys.js";
import type * as models_environments from "../models/environments.js";
import type * as models_flags from "../models/flags.js";
import type * as models_helpers from "../models/helpers.js";
import type * as models_projects from "../models/projects.js";
import type * as models_users from "../models/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "errors/index": typeof errors_index;
  http: typeof http;
  "infra/generateKeys": typeof infra_generateKeys;
  "models/environments": typeof models_environments;
  "models/flags": typeof models_flags;
  "models/helpers": typeof models_helpers;
  "models/projects": typeof models_projects;
  "models/users": typeof models_users;
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
