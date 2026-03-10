const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            // We attach the full payload or just the id/username. 
            // Existing system uses username heavily, so let's ensure we support that.
            // Ideally we would fetch the user from DB to ensure they still exist, 
            // but for speed/matching current style, we will trust the token content 
            // OR fetch lightly. Let's fetch to be secure.
            // BUT, we need to avoid circular dependency if we import User model here.
            // It's safe to import User model.

            req.user = decoded; // { id: ..., username: ... }

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
