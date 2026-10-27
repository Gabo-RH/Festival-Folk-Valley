import express from 'express';
import router from './router.js';
import { seedArtists } from './seed.js';

const app = express();
const port = process.env.PORT || 6767;

seedArtists();

app.use(express.json());
app.use('/api', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
