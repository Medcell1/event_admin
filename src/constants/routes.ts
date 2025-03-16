export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
  },
  DASHBOARD: {
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
    OVERVIEW: "/dashboard/overview",
    COMMANDES: "/dashboard/commandes",
    EVENTS: {
      ROOT: "/dashboard/events",
      CREATE: {
        PARAMETERS: "/dashboard/events/create/parameters",
        TICKETS: "/dashboard/events/create/tickets",
        PREVIEW: "/dashboard/events/create/preview",
      },
    },
    TEAMS: "/dashboard/team",
    VENDEURS: "/dashboard/vendeurs",
    RECHARGE: "/dashboard/recharge",
    NFC: "/dashboard/nfc",
    MESSAGES: "/dashboard/messages",
  },
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
};