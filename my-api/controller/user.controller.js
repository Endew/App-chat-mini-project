import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import user from "../model/user.model.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userController = {
    login: async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        try {
            const login = await user.login(username, password);
            if (!login) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const token = jwt.sign(
                        {
                            user_id: login.user_id,
                            username: login.user_username,
                            loginStatus: 1
                        },
                        JWT_SECRET,
                        {expiresIn: '1h'}
                    );
            res.json({token});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    showChat: async (req, res) => {
        try {
            const chat = await user.showChat();
            res.json(chat);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    sendChat: async (req, res) => {
        const { user_id, chat_text } = req.body;
        try {
            const [chat] = await user.sendChat(user_id, chat_text);
            res.json(chat);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default userController;