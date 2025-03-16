import { auth } from "./auth";

export default auth((req) => {
    const { nextUrl } = req;
  
    console.log("Middleware triggered:");
    console.log("Pathname:", nextUrl.pathname);
    console.log("Is Logged In:", !!req.auth);
  
    const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
    const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");
    const isLoggedIn = !!req.auth;
  
    if (isDashboardRoute && !isLoggedIn) {
      console.log("Redirecting to login from dashboard route.");
      return Response.redirect(new URL("/login", nextUrl));
    }
  
    if (isAuthRoute && isLoggedIn) {
      console.log("Redirecting to dashboard from auth route.");
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  
    console.log("No redirection needed.");
    return;
  });
  
  export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
  };
  