import { env } from "#env";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexHttpClient } from "convex/browser";

// to use server side
export const convexHttpClient = new ConvexHttpClient(env.VITE_CONVEX_SITE_URL);

// to use client side via provider
export const createConvexQueryClient = () =>
  new ConvexQueryClient(env.VITE_CONVEX_URL);
