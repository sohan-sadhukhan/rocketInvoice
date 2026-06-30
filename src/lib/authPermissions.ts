import { createAccessControl } from "better-auth/plugins";

const statement = {
  user: ["create", "list", "set-role", "ban", "impersonate", "delete"],
} as const;

export const customAc = createAccessControl(statement);

export const superAdmin = customAc.newRole({
  user: ["create", "list", "set-role", "ban", "impersonate", "delete"],
});

export const user = customAc.newRole({
  user: [],
});
