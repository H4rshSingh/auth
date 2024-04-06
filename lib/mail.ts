import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
});


export const sendVerificationEmail = async (
    email: string,
    token: string,
    name : string | null
) => {
    const confirmLink = `http://mynextauthapp.vercel.app/auth/new-verification?token=${token}`

    await transporter.sendMail({
        from: 'not.reply.mails@email.com', // sender address
        to: email,
        subject: "Confirm your email",
        html: `
            <div style="font-family: Helvetica,Arial,sans-serif; min-width:1200px; overflow:auto; line-height:2">
                <div style="margin:10px auto; width:70%; padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="http://mynextauthapp.vercel.app" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Auth</a>
                    </div>
                    <p style="font-size:1.1em">Hi, ${name}</p>
                    <p>Thank you for signing up on Auth.</p>
                    <p>Please click the link below to verify your email address: ${email}</p>
                    <a href="${confirmLink}">
                        <button  style="padding : 12px; background-color: #0096FF; cursor:pointer; border:none; cursor:pointer; color: white;">
                            Verify Email
                        </button>
                    </a>
                    <p style="font-size:0.9em;color:#FF0000">This link will expire in 1 hour. </p>
                    <p style="font-size:0.9em;">Regards,<br />Auth</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Auth</p>
                    </div>
                </div>
            </div>
        `
    });
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string, 
    name : string | null
) => {
    const resetLink = `http://mynextauthapp.vercel.app/auth/new-password?token=${token}`

    await transporter.sendMail({
        from: 'not.reply.mails@email.com', // sender address
        to: email,
        subject: "Reset your password",
        html: `
        <div style="font-family: Helvetica,Arial,sans-serif; min-width:1200px; overflow:auto; line-height:2">
        <div style="margin:10px auto; width:70%; padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="http://mynextauthapp.vercel.app" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Auth</a>
            </div>
            <p style="font-size:1.1em">Hi, ${name}</p>
            <p>Thank you for signing up on Auth.</p>
            <p>Please click the link below to reset your password.</p>
            <a href="${resetLink}">
                <button  style="padding : 12px; background-color: #0096FF; cursor:pointer; border:none; cursor:pointer; color: white;">
                    Reset Password
                </button>
            </a>
            <p style="font-size:0.9em;color:#FF0000">This link will expire in 1 hour.</p>
            <p style="font-size:0.9em;">Regards,<br />Auth</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Auth</p>
            </div>
        </div>
    </div>
        `
    });
}

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string,
    name: string | null
) => {

    await transporter.sendMail({
        from: 'not.reply.mails@email.com', // sender address
        to: email,
        subject: "2FA Code",
        html: `
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1200px;overflow:auto;line-height:2">
                <div style="margin:10px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="http://mynextauthapp.vercel.app" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Auth</a>
                    </div>
                    <p style="font-size:1.1em">Hi, ${name}</p>
                    <p>Thank you for using Auth.</p>
                    <p>Use the following OTP to sign in.</p>
                    <p style="font-size:0.9em;color:#FF0000">OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                        ${token}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Auth</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Auth</p>
                    </div>
                </div>
            </div>    
        `
    });
} 

export const sendChangeEmailToken = async (
    email: string,
    token: string,
    name: string | null
) => {

    await transporter.sendMail({
        from: 'not.reply.mails@email.com', // sender address
        to: email,
        subject: "OTP for Email Change",
        html: `
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1200px;overflow:auto;line-height:2">
                <div style="margin:10px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="http://mynextauthapp.vercel.app" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Auth</a>
                    </div>
                    <p style="font-size:1.1em">Hi, ${name}</p>
                    <p>Thank you for using Auth.</p>
                    <p>Use the following OTP to change your email.</p>
                    <p style="font-size:0.9em;color:#FF0000">OTP is valid for 5 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                        ${token}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Auth</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Auth</p>
                    </div>
                </div>
            </div>    
        `
    });
} 