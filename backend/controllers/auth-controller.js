import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import Verification from "../models/verification.js";
import sendEmail from "../utils/sendEmail.js";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
    try{
        const{ email, name, password } = req.body;

        const decision = await aj.protect(req, { email }); 
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
            return res.status(403).json({ 
                message: "Invalid email address",
                reason: decision.reason 
            });
        }

        const existingUser = await User.findOne({ email })

        if(existingUser){
           return res.status(400).json({
                message: "Email already in use"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            name,
            password: hashedPassword,
        });

        //TODO: send email
        const VerificationToken = jwt.sign(
            { userId: newUser._id, purpose: "email-verification" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        await Verification.create({
            userId: newUser._id,
            token: VerificationToken,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
        });

        //TODO: send email with SendGrid
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${VerificationToken}`;
        const emailBody = `<p> Click <a href="${verificationLink}">here</a> to verify your email address. This link will expire in 1 hour.</p>`;
        const emailSubject = "Verify your email address";

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);
        
        if (!isEmailSent) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        res.status(201).json({
            message: "Verification email sent to your email. Please check and verify your account",
            //userId: newUser._id,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: "internal server error"});

    }
};

const loginUser = async (req, res) => {
    try{

    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "internal server error"});

    }
};

const verifyEmail = async(req, res) => {
    try {
        const { token } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!payload) {
            return res.status(401).json({ message: "unauthorized" });
        }

        const { userId, purpose } = payload;

        if (purpose !== "email-verification") {
            return res.status(401).json({ message: "unauthorized" });
        }

        const verification = await Verification.findOne({ userId, token });
        
        if (!verification) {
            return res.status(401).json({ message: "unauthorized" });
        }
        const isTokenExpired = verification.expiresAt < new Date();
        
        if (isTokenExpired) {
            return res.status(401).json({ message: "Token has expired" });
        }
        
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(401).json({ message: "unauthorized" });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email Verified successfully" });
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "internal server error"});
}
};

export { registerUser, loginUser, verifyEmail };