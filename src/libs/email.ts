import { Resend } from "resend"

interface VerificationEmailProps {
    from: string,
    to: string,
    link: string
}

const resend = new Resend(process.env.EMAIL_SERVICE_API_KEY)

export const sendPasswordResetEmail = async ({ from, to, link }: VerificationEmailProps) => {
    await resend.emails.send({
        from,
        to,
        subject: "Reset Password",
        html: `
            <html>
                <head></head>
                <body>
                    <p>
                        Enter this link to reset your password
                    </p>
                    <button>
                        <a href="${link}">
                            Click Here
                        </a>
                    </button>
                </body>
            </html>
        `
    })
}

