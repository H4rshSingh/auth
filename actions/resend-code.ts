"use server";

import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/token";

export const resendCode = async(email: string) => {
    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email) {
        return { error: "Email does not exist!" };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(
                existingUser.email,
                twoFactorToken.token,
                existingUser.name
            );

        return { success: "Code sent!" };
    }
}