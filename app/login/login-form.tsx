"use client";
import { useState } from "react";
import { sendOtp, verifyOtp } from "./actions";
import { useRouter } from "next/navigation";
import { useUserStore } from "../user-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
  const { getCurrentUser } = useUserStore();
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
      setOtpSent(false);
      return;
    }
    getCurrentUser();
    router.push("/orders");
  };

  return (
    <Card className="animate-in p-5 dark:bg-background border w-[400px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!otpSent) signIn();
          else verify();
        }}
        className="flex flex-col gap-6"
      >
        {!otpSent ? (
          <>
            <p className="font-semibold text-2xl text-center">Connexion</p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="vous@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="on"
              />
            </div>
          </>
        ) : (
          <>
            <p className="font-semibold text-lg text-center">
              Un code à 6 chiffres a été envoyé à {email}
            </p>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Code à 6 chiffres</Label>
              <Input
                id="otp"
                type="text"
                placeholder="******"
                inputMode="numeric"
                pattern="\d*"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="flex flex-col flex-1 gap-4">
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full font-medium"
            type="submit"
          >
            {!otpSent ? "Connexion" : "Vérifier le code"}
          </Button>
          {error && (
            <div className="text-sm text-center">
              <p className="font-medium text-red-500">{error}</p>
            </div>
          )}
        </div>
      </form>
    </Card>
  );
}
