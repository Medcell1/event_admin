import { SignUpDTO } from "@/@types";
import createAxiosInstance from "@/lib/axios-instance";
import { signIn, signOut } from "next-auth/react";

const api = createAxiosInstance();
export const signup = async (data: SignUpDTO) => {
  try {
    if (!data.email) throw new Error("Email is required");
    if (!data.password) throw new Error("Password is required");

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await api.post("/auth/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error Creating account:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  if (!email) return { error: "Email is required" };
  if (!password) return { error: "Password is required" };

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return mapError(result.error);
    }

    return { success: true };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
};

const mapError = (errorCode: string) => {
  const errorMap: Record<string, string> = {
    CredentialsSignin: "Invalid email or password. Please try again.",
    UserNotFound: "No account found with this email. Please sign up.",
    UserBlocked: "Your account has been blocked. Contact support.",
    ServerError: "A server error occurred. Try again later.",
  };

  return { error: errorMap[errorCode] || "An unexpected error occurred." };
};

export const logout = () => {
  signOut({ callbackUrl: "/login" });
};
