"use server";

import { getUserByEmail } from "@/data/user";
import { sendChangeEmailToken } from "@/lib/mail";
import { generateChangeEmailToken } from "@/lib/token";

export const resendNewEmailCode = async (email: string, name: string) => {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email already exists!" };
    }

    const verificationToken = await generateChangeEmailToken(email);
    await sendChangeEmailToken(email, verificationToken.token, name);
    
    return { success: "Code sent!" };
}