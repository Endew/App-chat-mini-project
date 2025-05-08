const express = require('express');
const db = require('./db');
const app = express();
const port = 3001;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secretkey';

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await db('user')
        .where({ 
            user_username: username,
            user_pass: password
        })
        .select('user_id', 'user_username')
        .first();
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.user_username,
                loginStatus: 1
            },
            JWT_SECRET,
            {expiresIn: '1h'}
        )
        res.json(token);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/showChat', async (req, res) => {
    try {
        const chat = await db('chat')
            .join('user', 'chat.user_id', '=', 'user.user_id')
            .select(
                'chat.chat_id',
                'user.user_id',
                'user.user_username',
                'chat.chat_text',
                'chat.chat_time'
            )
            .orderBy('chat.chat_time', 'asc');
        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/sendChat', async (req, res) => {
    const { user_id, chat_text } = req.body;
    try {
        const [chat] = await db('chat').insert({
            user_id,
            chat_text,
            chat_time: new Date()
        }).returning('*');
        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});