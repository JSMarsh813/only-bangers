// Enums allow a developer to define a set of named constants

export enum GtagAction {
  SignupClick = "signup_click",
  SignupComplete = "signup_complete",
  LoginClick = "login_click",
}

export enum GtagCategory {
  Engagement = "engagement",
  // Engagement: Tracks user interactions that show interest or usage, but don’t necessarily result in a final goal
  // ex: scrolling, sign up button clicked but form not successfully submitted yet
  Conversion = "conversion",
  // Tracks actions that contribute directly to a business goal or revenue
  // ex: sign up complete (form successfully submitted)
  Navigation = "navigation",
}

type EventParams = {
  action: GtagAction;
  category: GtagCategory;
  label?: string;
  value?: number;
};

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

export const trackEvent = (params: EventParams) => {
  if (process.env.NODE_ENV !== "production") return;
  if (typeof window !== "undefined" && window.gtag) {
    const { action, category, label, value } = params;
    window.gtag("event", action, {
      event_category: category,
      ...(label && { event_label: label }),
      ...(value && { value }),
    });
  }
};
