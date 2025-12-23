import bcrypt from "bcryptjs";
import User from "../models/user.js";

const registerUser = async (req, res) => {
    try{
        const{ email, name, password } = req.body;

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

export { registerUser, loginUser };