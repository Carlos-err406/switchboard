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
import type * as api_keys_queries from "../api_keys/queries.js";
import type * as auth from "../auth.js";
import type * as environments_helpers from "../environments/helpers.js";
import type * as environments_mutations from "../environments/mutations.js";
import type * as environments_queries from "../environments/queries.js";
import type * as errors_index from "../errors/index.js";
import type * as flags_helpers from "../flags/helpers.js";
import type * as flags_mutations from "../flags/mutations.js";
import type * as flags_queries from "../flags/queries.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as infra_generateKeys from "../infra/generateKeys.js";
import type * as projects_helpers from "../projects/helpers.js";
import type * as projects_mutations from "../projects/mutations.js";
import type * as projects_queries from "../projects/queries.js";
import type * as users_helpers from "../users/helpers.js";
import type * as users_queries from "../users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "api_keys/helpers": typeof api_keys_helpers;
  "api_keys/queries": typeof api_keys_queries;
  auth: typeof auth;
  "environments/helpers": typeof environments_helpers;
  "environments/mutations": typeof environments_mutations;
  "environments/queries": typeof environments_queries;
  "errors/index": typeof errors_index;
  "flags/helpers": typeof flags_helpers;
  "flags/mutations": typeof flags_mutations;
  "flags/queries": typeof flags_queries;
  helpers: typeof helpers;
  http: typeof http;
  "infra/generateKeys": typeof infra_generateKeys;
  "projects/helpers": typeof projects_helpers;
  "projects/mutations": typeof projects_mutations;
  "projects/queries": typeof projects_queries;
  "users/helpers": typeof users_helpers;
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
