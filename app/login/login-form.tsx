"use client";
import { useState } from "react";
import { sendOtp, verifyOtp } from "./actions";
import { useRouter } from "next/navigation";

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validateOtp = (otp: string) => {
  return otp.length === 6 && /^\d+$/.test(otp);
};

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const signIn = async () => {
    if (!validateEmail(email)) return;
    setIsLoading(true);
    const res = await sendOtp(email);
    setIsLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    setOtpSent(true);
  };

  const verify = async () => {
    if (!validateOtp(otp)) return;
    setIsLoading(true);
    const res = await verifyOtp(email, otp);
    setIsLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    router.push("/orders");
  };

  return (
    <div className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
      {!otpSent ? (
        <>
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 disabled:bg-green-950 disabled:cursor-not-allowed"
            onClick={signIn}
            disabled={isLoading}
          >
            Sign In
          </button>
          <div className="text-sm text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </>
      ) : (
        <>
          <label className="text-md" htmlFor="otp">
            OTP
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
            onClick={verify}
            disabled={isLoading}
          >
            Verify OTP
          </button>
          <div className="text-sm text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </>
      )}
    </div>
  );
}
