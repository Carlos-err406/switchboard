import {
  genericError,
  mutationError,
  queryError,
  QueryErrorCode,
} from "./helpers";

export const notAuthenticated = () => genericError("Not authenticated");

export const noPermission = (action: string) =>
  genericError(`No permission to ${action}`);

export const projectNotFound = () =>
  queryError(QueryErrorCode.PROJECT_NOT_FOUND, "Project not found");

export const projectAlreadyExist = () =>
  mutationError({
    name: ["A project with that name already exists"],
  });

export const flagNotFound = () =>
  queryError(QueryErrorCode.FLAG_NOT_FOUND, "Flag not found");

export const environmentNotFound = () =>
  queryError(QueryErrorCode.ENVIRONMENT_NOT_FOUND, "Environment not found");

export const cantDeleteTheLastEnvironment = () =>
  genericError("Can not delete the last environment");

export const notAProjectMember = () =>
  genericError("You are not a project member");

export const userNotAProjectMember = () =>
  genericError("User is not a project member");

export const environmentAlreadyExist = () =>
  mutationError({
    name: ["An environment with that name already exist in this project"],
  });

export const flagAlreadyExistInEnvironment = () =>
  mutationError({
    name: ["A flag with that name already exist in this environment"],
  });

export const apikeyAlreadyExist = () =>
  mutationError({
    name: ["An api key with that name already exist in this environment"],
  });

export const apiKeyNotFound = () =>
  queryError(QueryErrorCode.API_KEY_NOT_FOUND, "Api key not found");

export const apiKeyDisabled = () =>
  queryError(QueryErrorCode.API_KEY_NOT_FOUND, "API key disabled");

export const apiKeyExpired = () =>
  queryError(QueryErrorCode.API_KEY_NOT_FOUND, "API key expired");

export const userNotFound = () =>
  queryError(QueryErrorCode.USER_NOT_FOUND, "User not found");

export const tokenNotFound = () =>
  queryError(QueryErrorCode.TOKEN_NOT_FOUND, "Token not found");

export const tokenExpired = () =>
  queryError(QueryErrorCode.TOKEN_EXPIRED, "Token expired");

export const tokenAlreadyUsed = () =>
  queryError(QueryErrorCode.TOKEN_ALREADY_USED, "Token already used");

export const cantModifyProjectOwner = () =>
  genericError("Cannot modify or remove the project owner");

export const cantRemoveLastMember = () =>
  genericError("Cannot remove the last member of a project");

export const cantRemoveLastManager = () =>
  genericError(
    "Cannot remove or downgrade the last member with member management permissions",
  );
