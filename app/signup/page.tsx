"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import {
  signUpWithEmail,
  signInWithGoogle,
  getFriendlyErrorMessage,
} from "@/lib/authService";
import { toast } from "sonner";
import { useLocalization } from "@/lib/localization";

export default function SignupPage() {
  const { t } = useLocalization();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Get redirect URL from query params
  const redirectTo = searchParams.get("from") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (password.length < 6) {
      toast.error(t("signup_password_too_short_toast"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("signup_passwords_no_match_toast"));
      return;
    }

    setIsLoading(true);

    try {
      const { user, error } = await signUpWithEmail(email, password);

      if (error) {
        toast.error(getFriendlyErrorMessage(error));
        setIsLoading(false);
        return;
      }

      if (user) {
        toast.success(t("signup_success_toast"));
        router.push(redirectTo);
      }
    } catch (err) {
      toast.error(t("unexpected_error_toast"));
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const { user, error } = await signInWithGoogle();

      if (error) {
        toast.error(getFriendlyErrorMessage(error));
        setIsGoogleLoading(false);
        return;
      }

      if (user) {
        toast.success(t("signup_success_toast"));
        router.push(redirectTo);
      }
    } catch (err) {
      toast.error(t("unexpected_error_toast"));
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex">
      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md space-y-3">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-primary">
              {t("signup_create_account")}
            </h2>
            <p className="text-gray-600">
              {t("signup_get_started")}
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-semibold text-center text-primary">
                {t("signup_title")}
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                {t("signup_enter_information")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t("signup_email_label")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("signup_email_placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      {t("signup_password_label")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("signup_password_placeholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12 pr-12 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      {t("signup_confirm_password_label")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("signup_confirm_password_placeholder")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-12 pr-12 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-linear-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t("signup_creating_account")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{t("signup_create_account_button")}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      {t("login_or_continue_with")}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="h-12 border-gray-200 m-auto w-42 flex items-center hover:bg-gray-50"
                >
                  {isGoogleLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Google
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                {t("signup_already_have_account")}{" "}
                <a
                  href="/login"
                  className="text-green-600 hover:text-green-800 font-medium hover:underline"
                >
                  {t("signup_sign_in")}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
