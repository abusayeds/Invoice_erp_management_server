import { permissions, rolePermission } from "./rolePermission";
type TreeValues<T> = T extends readonly (infer Addon)[]
  ? Addon extends { modules: readonly (infer Mod)[] }
    ? Mod extends { permissions: readonly (infer Item)[] }
      ? Item extends { value: infer V }
        ? V
        : never
      : never
    : never
  : never;

export type TPermissionKey = TreeValues<typeof rolePermission>;

type SnakeCase<S extends string> = S extends `${infer H}-${infer T}`
  ? `${SnakeCase<H>}_${SnakeCase<T>}`
  : Lowercase<S>;

type PermLeaves<M extends { permissions: readonly { value: string }[] }> = {
  [P in M["permissions"][number]["value"] as P]: P;
};

type ModuleShape<M extends { module: string; permissions: readonly { value: string }[] }> = {
  [K in SnakeCase<M["module"]>]: PermLeaves<M>;
};

type AddonShape<A extends { addOn: string; modules: readonly { module: string; permissions: readonly { value: string }[] }[] }> = {
  [K in SnakeCase<A["addOn"]>]: UnionToIntersection<
    A["modules"][number] extends infer M
      ? M extends { module: string; permissions: readonly { value: string }[] }
        ? ModuleShape<M>
        : never
      : never
  >;
};

type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never;

export type PermissionNav = UnionToIntersection<
  (typeof rolePermission)[number] extends infer A
    ? A extends { addOn: string; modules: readonly { module: string; permissions: readonly { value: string }[] }[] }
      ? AddonShape<A>
      : never
    : never
>;

const toSnakeKey = (raw: string) => raw.replace(/-/g, "_").toLowerCase();

const buildPermission = (tree: typeof rolePermission): PermissionNav => {
  const root: Record<string, Record<string, Record<string, string>>> = {};
  for (const addOn of tree) {
    const addKey = toSnakeKey(addOn.addOn);
    if (!root[addKey]) root[addKey] = {};
    for (const mod of addOn.modules) {
      const modKey = toSnakeKey(mod.module);
      if (!root[addKey][modKey]) root[addKey][modKey] = {};
      for (const perm of mod.permissions) {
        root[addKey][modKey][perm.value] = perm.value;
      }
    }
  }
  return root as PermissionNav;
};

export const permission = buildPermission(rolePermission);

export const PERMISSION_SET = new Set<string>(permissions);
export const PERMISSION_VALUE_SET = PERMISSION_SET;
export const PERMISSION_VALUES = permissions;

export const isPermission = (value: string): value is TPermissionKey =>
  PERMISSION_SET.has(value);
