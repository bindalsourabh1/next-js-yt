import {resend} from "@lib/resend";

import VerificationEmail  from "../../emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerifyEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail(username, verifycode),
        })


        return {success: true, message: 'Verification Email sent successfully'}
    }catch (emailError){
        console.log("Error sending verification Emails", emailError)
        return {success: false, message: 'Failed to send verification Email'}
    }
}