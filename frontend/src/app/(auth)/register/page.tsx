"use client";

import { useState } from "react";
import { djangoService } from "@/services/djangoService";
import { RegisterData } from "@/types/auth";
import { GoogleIcon } from "@/components/shared/ui/icons/GoogleIcon";
import { Linkedin, LinkedinIcon } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (!formData.email || !formData.username || !formData.password) {
        throw new Error("All fields are required.");
      }

      await djangoService.register(formData);
      setSuccess("Registration successful! You can now log in.");
      setFormData({ username: "", email: "", password: "", phone: "" });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-h-full text-black items-center justify-center">
      <div className="  p-4 w-full ">
        <h1 className="text-2xl font-bold mb-6 text-center">Registration</h1>
        <form onSubmit={handleSubmit} className=" space-y-4 text-sm">
          <div className="flex w-full gap-2 items-center justify-center">
            <label className="flex-1" htmlFor="fullname">
              Fullname
            </label>
            <label className="flex-1" htmlFor="username">
              Username
            </label>
          </div>
          <div className="flex w-full gap-2  items-center justify-center">
            <input
              id="fullname"
              type="text"
              name="username"
              placeholder="Username"
              className="w-1/2 flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="username..."
              className="w-1/2 flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex w-full gap-2 items-center justify-center">
            <label className="flex-1" htmlFor="email">
              Email
            </label>
            <label className="flex-1" htmlFor="phone">
              Phone Number
            </label>
          </div>
          <div className="flex w-full gap-2 items-center justify-center">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="phone"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              name="password1"
              id="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPasword">Confirm Password</label>
            <input
              id="confirmPasword"
              type="password"
              name="password2"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <label
            htmlFor="terms"
            className="flex items-center space-x-2 cursor-pointer select-none"
          >
            <input type="checkbox" id="terms" />
            <span>I agree to the Terms and Conditions.</span>
          </label>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <button className="w-1/2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
              Sign In
            </button>
          </div>
          <div className="flex w-full gap-2 justify-center items-center">
            <hr className="w-1/3"></hr>
            <span className="w-1/3">Or Continue with</span>
            <hr className="w-1/3"></hr>
          </div>

          <div className="w-full  flex gap-4">
            <button className="w-1/2 flex gap-2 items-center justify-center py-2 border rounded-md ">
              <GoogleIcon />
              Google
            </button>
            <button className="w-1/2 flex gap-2 items-center justify-center py-2 border rounded-md">
              <Linkedin />
              Linked In
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-600 text-sm text-center">{success}</p>
          )}
        </form>
      </div>
    </div>
  );
}
