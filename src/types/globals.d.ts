// types/global.d.ts
export {};

declare global {
  type GtagParamValue = string | number | boolean | undefined;
  // google tags are always primitives, so use them for param types

  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      params?: Record<string, GtagParamValue>,
    ) => void;
  }
}
