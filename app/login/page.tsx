"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LOGIN_API_URL } from "@/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        router.push("/chat");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API error responses
        const errorMessage =
          data.message || data.error || "Invalid email or password. Please try again.";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Store authentication token if provided
      if (data.authToken || data.token) {
        localStorage.setItem("authToken", data.authToken || data.token);
        localStorage.setItem("advisor_authenticated", "true");
        
        // Store user data if provided
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        router.push("/chat");
      } else {
        // If no token but successful response, still authenticate
        localStorage.setItem("advisor_authenticated", "true");
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        router.push("/chat");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Network error. Please check your connection and try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/95 to-black/95 p-8 shadow-2xl shadow-red-900/20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-red-500">
              Student Advisor Portal
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to access the AI-powered advising system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-700/50 bg-gray-900/50 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-red-600/30 transition hover:bg-red-700 hover:shadow-2xl hover:shadow-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 ring-1 ring-white/10"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Secure access for authorized academic advisors only
        </p>
      </div>
    </div>
  );
}

