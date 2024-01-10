"use client";
import { useState } from "react";
import { sendOtp, verifyOtp } from "./actions";
import { useRouter } from "next/navigation";
import { Button, CardBody, CardFooter, Input } from "@nextui-org/react";
import Card from "@/components/Card";
import { useUserStore } from "../user-store";

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
    <div className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
      <Card className="p-2">
        <CardBody>
          {!otpSent ? (
            <Input
              label="Email"
              type="email"
              placeholder="vous@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="on"
            />
          ) : (
            <Input
              label="Code à 6 chiffres"
              type="text"
              placeholder="******"
              inputMode="numeric"
              pattern="\d*"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}
        </CardBody>
        <CardFooter>
          <div className="flex flex-col flex-1 gap-4">
            <Button
              color="success"
              onClick={!otpSent ? signIn : verify}
              disableRipple
              isLoading={isLoading}
              className="w-full font-medium"
            >
              {!otpSent ? "Connexion" : "Vérifier le code"}
            </Button>
            {error && (
              <div className="text-sm text-center">
                <p className="font-medium text-red-500">{error}</p>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
