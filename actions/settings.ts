"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "@/data/user";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { generateChangeEmailToken } from "@/lib/token";
import { sendChangeEmailToken } from "@/lib/mail";
import { unstable_update } from "@/auth";


export const settings = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser();
    if (!user || !user?.id) {
        return { error: "User not found" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized!" };
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        if (values.emailVerificationOTP) {
            const verificationToken = await db.verificationToken.findFirst({
                where: {
                    email: values.email,
                }
            });

            if (!verificationToken) {
                return { error: "Invalid OTP!" };
            }
            if (values.emailVerificationOTP !== verificationToken.token) {
                return { error: "Invalid code!" };
            }

            const hasExpired = new Date() > new Date(verificationToken.expires);

            if (hasExpired) {
                return { error: "Code has expired!" };
            }

            await db.verificationToken.delete({
                where: {
                    id: verificationToken.id
                }
            });

            values.email = verificationToken.email;
            values.emailVerificationOTP = undefined;
        } else {
            const existingUser = await getUserByEmail(values.email);

            if (existingUser && existingUser.id !== user.id) {
                return { error: "Email already exists!" };
            }

            const verificationToken = await generateChangeEmailToken(values.email);
            await sendChangeEmailToken(values.email, verificationToken.token, dbUser.name);

            return { codeSent: true };
        }
    }



    if (values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);

        if (!passwordMatch) {
            return { error: "Incorrect password!" };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    // can also use unstable_update to update the session user
    await unstable_update({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
            role: updatedUser.role,
            image: updatedUser.image,
        }
    });

    return { success: "Settings Updated!" }
}
