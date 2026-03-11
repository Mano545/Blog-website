const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already taken" });

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({
            message: "Registration successful",
            _id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token: generateToken(newUser.id, newUser.username),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid username or password" });

        if (user.isBlocked) return res.status(403).json({ message: "Account is blocked" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid username or password" });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                about: user.about,
            },
            token: generateToken(user.id, user.username),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

const updateMe = async (req, res) => {
    const { email, avatar, bio, about } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update only allowed fields
        if (typeof email === "string") user.email = email;
        if (typeof avatar === "string") user.avatar = avatar;
        if (typeof bio === "string") user.bio = bio;
        if (typeof about === "string") user.about = about;

        await user.save();

        return res.status(200).json({
            message: "Profile updated",
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                about: user.about,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser, getMe, updateMe };
