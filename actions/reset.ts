"use server"

import * as z from 'zod';

import { ResetSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { generateResetToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/mail';

export const reset = async (values : z.infer<typeof ResetSchema>) => {
    const validateFields = ResetSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: "Invalid email!" };
    }
    const { email } = values;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        return { error: 'Email not found!'};
    }

    // Generate reset token
    const passwordResetToken = await generateResetToken(email);

    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token, existingUser.name);

    return { success : "Reset email sent!" };
}