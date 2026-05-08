const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }
            if (user.isBlocked) {
                return res.status(403).json({ message: "Account is blocked" });
            }
            req.user = {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                about: user.about,
                role: user.role,
                isBlocked: user.isBlocked,
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
module.exports = { protect };
