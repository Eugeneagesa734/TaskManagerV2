import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import Verification from "../models/verification.js";
import sendEmail from "../utils/sendEmail.js";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
    try{
        const{ email, name, password } = req.body;

        const decision = await aj.protect(req, { 
            email,
            requested: 1 
        }); 
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

        const VerificationToken = jwt.sign(
            { userId: newUser._id, purpose: "email-verification" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        await Verification.create({
            userId: newUser._id,
            token: VerificationToken,
            expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });
      //  Send verification email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${VerificationToken}`;
        const emailBody = `<p> Click <a href="${verificationLink}">here</a> to verify your email address. This link will expire in 1 hour.</p>`;
        const emailSubject = "Verify your email address";

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);
        
        if (!isEmailSent) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        res.status(201).json({
            message: "Verification email sent to your email. Please check and verify your account",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error"});
    }
};

const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        
        const user = await User.findOne({ email }).select("+password");
        
        if(!user){
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        
        if(!user.isEmailVerified){
            const existingVerification = await Verification.findOne({ userId: user._id });

            if (existingVerification &&  existingVerification.expiresAt > new Date()) {
                return res.status(400).json({
                    message: "Email not verified. Please check your email for verification link."
                });
            } else {
                if (existingVerification) {
                    await Verification.findByIdAndDelete(existingVerification._id);
                }

                const verificationToken = jwt.sign(
                    { userId: user._id, purpose: "email-verification" },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                await Verification.create({
                    userId: user._id,
                    token: verificationToken,
                    expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
                });

                // Resend verification email
                const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
                const emailBody = `<p> Click <a href="${verificationLink}">here</a> to verify your email address. This link will expire in 1 hour.</p>`;
                const emailSubject = "Verify your email address";

                const isEmailSent = await sendEmail(email, emailSubject, emailBody);
                
                if (!isEmailSent) {
                    return res.status(500).json({ message: "Failed to send verification email" });
                }

                return res.status(201).json({
                    message: "Verification email sent to your email. Please check and verify your account",
                });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id, purpose: "login" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        user.lastLogin = new Date();
        await user.save();

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });

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
        
        user.isEmailVerified = true;
        await user.save();

        await Verification.findByIdAndDelete(verification._id);

        res.status(200).json({ message: "Email Verified successfully" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error"});
    }
};

const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        
        if(!user.isEmailVerified) {
            return res.status(400).json({ message: "Please verify your email first"})
        }
        
        const existingVerification = await Verification.findOne({
            userId: user._id,
        });

        if (existingVerification && existingVerification.expiresAt > new Date()) {
            return res.status(400).json({ message: "Reset password request already sent" });
        }

        if (existingVerification && existingVerification.expiresAt <= new Date()) {
            await Verification.findByIdAndDelete(existingVerification._id);
        }

        const resetPaswordToken = jwt.sign(
            { userId: user._id, purpose: "reset-password" },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        await Verification.create({
            userId: user._id,
            token: resetPaswordToken,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPaswordToken}`;
        const emailBody = `<p> Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 15 minutes.</p>`;
        const emailSubject = "Reset your password";
    
        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
            return res.status(500).json({ message: "Failed to send reset password email" });
        }

        res.status(200).json({
            message: "Reset password email sent. Please check your email.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error"});
    }
}

const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!payload) {
            return res.status(401).json({ message: "unauthorized" });
        }
    
        const { userId, purpose } = payload;
        
        if (purpose !== "reset-password") {
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

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        await user.save();
        
        await Verification.findByIdAndDelete(verification._id);

        res.status(200).json({ message: "Password reset successfully" });
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error"});
    }
};

export { registerUser, loginUser, verifyEmail, resetPasswordRequest, verifyResetPasswordTokenAndResetPassword };