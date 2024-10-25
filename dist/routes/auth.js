import { User } from "../dbSchemas/user.js";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../dbSchemas/refresh.js";
import { Router } from "express";
const router = Router();
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const user = new User({
        name: name,
        email: email,
        password: password,
    });
    await user.save();
    return res.sendStatus(500);
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
        return res.status(404).json({ message: "Email Doesn't Exist" });
    if (user.password !== password)
        return res.status(401).json({ message: "Password Incorrect" });
    const access_token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    const refresh_token = new RefreshToken({
        token: jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET),
    });
    await refresh_token.save();
    return res.json({
        access_token: access_token,
        refresh_token: refresh_token,
    });
});
export default router;
