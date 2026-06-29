import Cookies from "js-cookie";

const AUTH_COOKIE_NAME = "admin_session";
const AUTH_TOKEN = "sipahioglu_admin_authenticated";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Cookies.get(AUTH_COOKIE_NAME) === AUTH_TOKEN;
}

export function login(password: string): boolean {
  const correctPassword = process.env.ADMIN_PASSWORD || "sipahioglu2024";

  if (password === correctPassword) {
    Cookies.set(AUTH_COOKIE_NAME, AUTH_TOKEN, { expires: 7 });
    return true;
  }

  return false;
}

export function logout(): void {
  Cookies.remove(AUTH_COOKIE_NAME);
}
