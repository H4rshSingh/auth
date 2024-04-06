"use client";

import { CardWrapper } from "./card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

import * as z from 'zod';
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { PasswordInput } from "./password-input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { resendCode } from "@/actions/resend-code";



export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === 'OAuthAccountNotLinked'
        ? "Email already in use with different provider"
        : "";

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const [twoFactorEmail, setTwoFactorEmail] = useState<string>("");
    const [isResendCodeDisabled, setIsResendCodeDisabled] = useState<boolean>(true);
    const [resendTimer, setResendTimer] = useState<number>(60);

    useEffect(() => {
        if (showTwoFactor && resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        if (resendTimer === 0) {
            setIsResendCodeDisabled(false);
        }
    }, [showTwoFactor, isResendCodeDisabled, resendTimer,]);
 
    const handleResendCode = () => {
        setError("");
        setSuccess("");
        resendCode(twoFactorEmail)
            .then((response) => {
                if (response?.error) {
                    setError(response.error);
                }
                if (response?.success) {
                    setSuccess(response.success);
                }
            })
            .catch((error) => {
                setError("Something went wrong!");
            })
            .finally(() => {
                setIsResendCodeDisabled(true);
                setResendTimer(60);
            })
    }

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");
        startTransition(() => {
            login(values)
                .then((response) => {
                    if (response?.error) {
                        setError(response.error);
                    }
                    if (response?.success) {
                        setSuccess(response.success);
                    }
                    if (response?.twoFactor) {
                        setShowTwoFactor(true);
                        setTwoFactorEmail(values.email);
                        setResendTimer(60)
                    }
                })
                .catch((error) => {
                    setError("Something went wrong!");
                });
        });
    }


    const handleBack = () => {
        setError("");
        setSuccess("");
        setShowTwoFactor(!showTwoFactor);
        setShowTwoFactor(false)
        form.reset();
    }


    return (
        <CardWrapper
            headerLabel="Welcome back!"
            backButtonLabel={!showTwoFactor ? "Don't have an account?" : ""}
            backButtonHref="/auth/register"
            showSocial={!showTwoFactor}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code </FormLabel>
                                        <FormDescription>2FA code sent to {twoFactorEmail}</FormDescription>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field} >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="px-0 text-bue-600 disabled:text-black-600"
                                            disabled={isResendCodeDisabled}
                                            onClick={handleResendCode}
                                            type="button"
                                        >
                                            Resend Code
                                        </Button>
                                        {isResendCodeDisabled &&
                                            <span className="text-blue-600 text-xs"> in {resendTimer}</span>
                                        }
                                    </FormItem>

                                )}
                            />
                        )}

                        {!showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field}
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput {...field}
                                                    type="password"
                                                    placeholder="********"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                asChild
                                                className="px-0 "
                                            >
                                                <Link href="/auth/reset">
                                                    Forgot Password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>

                                    )}
                                />
                            </>
                        )}
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button disabled={isPending} type="submit" className="w-full">
                        {showTwoFactor ? "Verify" : "Login"}
                    </Button>

                </form>
            </Form>

            {(showTwoFactor && <Button
                variant="link"
                size="sm"
                className="w-full mt-2 mb-[-10px] px-0"
                onClick={handleBack}
            >
                Back
            </Button>
            )}
        </CardWrapper>
    )
}