/* eslint-disable no-var */
declare global {
  // Admin session tokens stored in-memory on the server (used by admin API routes)
  var __adminTokens: Set<string> | undefined;
}

export {};
