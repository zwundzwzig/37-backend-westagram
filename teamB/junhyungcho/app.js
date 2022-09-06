require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

const { DataSource } = require('typeorm');

const database = new DataSource({
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: process.env.TYPEORM_PORT,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE
});

database.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => {
        console.error(err);
        database.destroy();
    });
;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(routes);

app.get('/ping', cors(), (req, res, next) => res.status(200).json({ message : "pong" }));


app.post('/users', async (req, res, next) => {
    const { first_name, last_name, age } = req.body;

    await database.query(
        `INSERT INTO users(
            first_name,
            last_name,
            age
        ) VALUES (?, ?, ?);
        `,
        [ first_name, last_name, age ]
    );

    res.status(201).json({ message : "userCreated" });
});

//Create post
app.post('/posts', async (req, res, next) => {
    const { title, description, coverImage } = req.body;

    await database.query(
        `INSERT INTO posts(
            title,
            description,
            cover_image
        ) VALUES (?, ?, ?);
        `,
        [ title, description, coverImage ]
    );

    res.status(201).json({ message : "postingCreated" });
});

// Get all posts
app.get('/posts', async (req, res) => {
    await database.query(
        `SELECT
            p.id,
            p.title,
            p.description,
            p.cover_image
        FROM posts p
        `,(err, rows) => {
                res.status(200).json(rows);
    });
})

//Get all posts along with users
app.get('/users', async (req, res) => {
    await database.query(
        `SELECT
            posts.id, 
            posts.title, 
            posts.description, 
            posts.cover_image, 
            users.first_name, 
            users.last_name, 
            users.age 
        FROM likes l 
        INNER JOIN users ON l.users_id = users.id 
        INNER JOIN posts ON l.posts_id = posts.id
        `, (err, rows) => {
            res.status(200).json(rows);
    });
});

//Update a single user by its primary key
app.patch('/posts', async(req, res) => {
    const { title, description, coverImage, postId } = req.body;
    
    await database.query(
        `UPDATE posts
        SET
            title = ?,
            description = ?,
            cover_image = ?
        WHERE id = ?
        `,
        [ title, description, coverImage, postId ]
    );
        res.status(201).json({ message : "successfully updated" });
});

//Delete a post
app.delete('/posts/:postId', async(req, res) => {
    const { postId } = req.params;

    await database.query(
        `DELETE FROM posts
        WHERE posts.id = ${postId}`
    );
        res.status(204).json({ message : "successfully deleted" });
})

//Likes
app.post('/likes', async(req, res) => {
    const { userId, postId } = req.body;

    await database.query(
        `INSERT INTO likes (
            users_id,
            posts_id
        ) VALUES (?, ?)
        `, [ userId, postId ]
    );
        res.status(201).json({ message : "likeCreated" });
})

// start server
const start = async () => {
    try {
        server.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
    } catch (err) {
        throw err; //상위 컨텍스트로 에러 전파
    } finally {
        console.log('===========================================');
    }
};

start();
// module.exports = { app };