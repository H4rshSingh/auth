"use client";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import {
    Form,
    FormField,
    FormControl,
    FormLabel,
    FormDescription,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingsSchema } from "@/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { PasswordInput } from "@/components/auth/password-input";
import { resendCode } from "@/actions/resend-code";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { resendNewEmailCode } from "@/actions/resend-new-email-code";

const SettingsPage = () => {
    const user = useCurrentUser();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPending, startTransition] = useTransition()
    const [changePassword, setChangePassword] = useState(false);
    const { update } = useSession()

    const handleChangePassword = () => {
        setChangePassword(!changePassword)
    }

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            role: user?.role || undefined,
            password: undefined,
            newPassword: undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
            emailVerificationOTP: undefined
        }
    })
    const [showNewEmailVerification, setShowNewEmailVerification] = useState(false);
    const [isResendCodeDisabled, setIsResendCodeDisabled] = useState<boolean>(true);
    const [resendTimer, setResendTimer] = useState<number>(60);
    const [newEmail, setNewEmail] = useState("");

    useEffect(() => {
        if (showNewEmailVerification && resendTimer > 0) {
            const interval = setInterval(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        if (resendTimer === 0) {
            setIsResendCodeDisabled(false);
        }
    }, [showNewEmailVerification, isResendCodeDisabled, resendTimer,]);

    const handleResendCode = () => {
        setError("");
        setSuccess("");
        resendNewEmailCode(newEmail, user?.name || "")
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

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        setError('')
        setSuccess('')
        startTransition(() => {
            settings(values)
                .then((response) => {
                    if (response?.error) {
                        setError(response.error)
                    }
                    if (response?.success) {
                        update();
                        setSuccess(response.success)
                        setShowNewEmailVerification(false);
                    }
                    if (response?.codeSent) {
                        setShowNewEmailVerification(true);
                        setNewEmail(values.email || "");
                        setResendTimer(30);
                    }
                })
                .catch(() => setError("Something went wrong"))
        })
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            {
                                showNewEmailVerification ?
                                    <FormField
                                        control={form.control}
                                        name="emailVerificationOTP"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Verification Code </FormLabel>
                                                <FormDescription>Code sent to {newEmail}</FormDescription>
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

                                    :
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="John Doe"
                                                            disabled={isPending}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {!user?.isOAuth &&
                                            <>
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="johndoe@example.com"
                                                                    disabled={isPending}
                                                                    type="email"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {
                                                    !changePassword ?
                                                        <Button onClick={handleChangePassword} variant="link" className="pl-0">Change Password</Button>
                                                        :
                                                        <>
                                                            <FormField
                                                                control={form.control}
                                                                name="password"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Current Password</FormLabel>
                                                                        <FormControl>
                                                                            <PasswordInput
                                                                                {...field}
                                                                                placeholder="********"
                                                                                disabled={isPending}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="newPassword"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>New Password</FormLabel>
                                                                        <FormControl>
                                                                            <PasswordInput
                                                                                {...field}
                                                                                placeholder="********"
                                                                                disabled={isPending}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </>
                                                }
                                            </>}
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Role</FormLabel>
                                                    <Select
                                                        disabled={isPending}
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a role" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={UserRole.ADMIN}>
                                                                Admin
                                                            </SelectItem>
                                                            <SelectItem value={UserRole.USER}>
                                                                User
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {!user?.isOAuth &&
                                            (
                                                <FormField
                                                    control={form.control}
                                                    name="isTwoFactorEnabled"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                            <div className="space-y-0.5">
                                                                <FormLabel>Two Factor Authentication</FormLabel>
                                                                <FormDescription>
                                                                    Enable two factor authentication for your account.
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    disabled={isPending}
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />

                                                        </FormItem>
                                                    )}
                                                />
                                            )
                                        }
                                    </>
                            }
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button type="submit" className="w-full">{showNewEmailVerification ? "Verify" : "Save"}</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default SettingsPage;