type ClassValue = string | false | null | undefined;

/** Tiny className joiner: cn("a", cond && "b") */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
