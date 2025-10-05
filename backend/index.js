import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './src/database/db.js';
import userRoutes from './src/routes/user.routes.js'
import courseRoutes from './src/routes/course.routes.js'
import adminRoutes from './src/routes/admin.routes.js'

dotenv.config({});
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,// needed for cookies
}));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/admin', adminRoutes);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    connectDB();
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})