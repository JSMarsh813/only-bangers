const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

const isProd = process.env.NODE_ENV === "production";

export const pageview = (url: string) => {
  if (!isProd) return;
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = (params: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!isProd) return;
  if (typeof window !== "undefined" && window.gtag) {
    const { action, category, label, value } = params;
    window.gtag("event", action, {
      event_category: category,
      ...(label && { event_label: label }),
      ...(value && { value }),
    });
  }
};
