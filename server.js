import 'dotenv/config'
import express from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define your routes
import userRoutes from './routes/users.js';
import postRoutes from './routes/post.js';
import likeRoutes from './routes/like.js';
import followRoutes from './routes/follow.js';
import chatRoutes from './routes/chat.js';

app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/chat', chatRoutes);

app.listen(8080, () => {
  console.log('Server started on port 8080');
});
