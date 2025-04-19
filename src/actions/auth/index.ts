// src/actions/auth.ts
import { SignUpDTO } from "@/@types";
import createAxiosInstance from "@/lib/axios-instance";
import { signIn, signOut } from "next-auth/react";
import { Validator, required, minLength, email } from "@/utils/validation";

const api = createAxiosInstance();

export const signup = async (data: SignUpDTO) => {
  try {
    const validator = new Validator(data, {
      email: email(),
      password: (value) => {
        const requiredCheck = required("Password")(value);
        if (requiredCheck) return requiredCheck;
        return minLength("Password", 6)(value);
      },
      name: required("Name"),
      userType: required("User Type"),
    });

    if (validator.hasErrors()) {
      throw new Error(validator.getFirstError()!);
    }

    const response = await api.post("/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error Creating account:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  const validator = new Validator(
    { email, password },
    {
      email: required("Email"),
      password: required("Password"),
    }
  );

  if (validator.hasErrors()) {
    return { error: validator.getFirstError()! };
  }

  try {
    const result = await signIn("credentials", {
      identifier: email,
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
