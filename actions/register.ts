"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error : "Invalid fields!"}
    }

    const {email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    
    if(existingUser) {
        return {error : "User already exists!"}
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        }
    })

    const verificationToken = await generateVerificationToken(email);
    // send verification email
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
        name
    );


    return {success : "Confirmation email sent!"};
}