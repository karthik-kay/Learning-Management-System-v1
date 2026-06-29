"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { djangoService } from "@/services/djangoService";

import { Chrome, Linkedin } from "lucide-react";

const ROLE_REDIRECTS: Record<string, string> = {
  admin: "/admin/dashboard",
  faculty: "/faculty/dashboard",
  student: "/student/dashboard",
  sales_exec: "/sales/dashboard",
  institution_admin: "/institution/dashboard",
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;

    if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }

    return "Something went wrong";
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await djangoService.login({ username, password });

      Cookies.set("access_token", data.access, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("user_role", data.role, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      const redirectPath = ROLE_REDIRECTS[data.role] ?? "/login";

      window.location.href = redirectPath;
    } catch (err: unknown) {
      console.error(err);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-8 text-black">
      <div className="w-full flex flex-col gap-6 text-black">
        <h2 className="mx-auto text-3xl font-semibold">Login</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              placeholder="Enter your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-2 gap-4 w-full">
            <button type="submit" className="bg-primary text-white p-2 rounded">
              Login
            </button>

            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Signup
            </button>
          </div>
        </form>

        <div className="grid grid-cols-3 w-full gap-2 items-center">
          <hr className="border-border-gray" />

          <span className="text-border-gray font-semibold flex-center">
            Or Login with
          </span>

          <hr className="border-border-gray" />
        </div>

        <div className="w-full mt-4 flex flex-col gap-8">
          <button className="flex-center gap-2 items-center py-2 border rounded-md">
            <Chrome size={20} />
            <span>Google</span>
          </button>

          <button className="flex-center gap-2 items-center py-2 border rounded-md">
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
