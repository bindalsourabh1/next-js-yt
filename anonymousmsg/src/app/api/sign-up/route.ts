import { sendVerifyEmail } from "@/helpers/sendVefiyEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exists"
            }, {status: 400})
        }
        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists with email"
                }, {status: 400})
            }else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifycode = verifyCode;
                existingUserByEmail.verifycodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifycodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        
        //send Verification Email
        const emailResponse = await sendVerifyEmail(email, username, verifyCode);
        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }
        return Response.json({
            success: true,
            message: "User Registered Successfully. Please Verify your email"
        }, {status: 201})

    }catch(error){
        console.error('Error registering User', error);
        return Response.json({
            success: false,
            message: "Failed to register User"
        },
        {
            status: 500
        }
    )
    }
}