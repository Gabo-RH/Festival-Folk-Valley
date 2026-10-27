import express from 'express';
import {
  getArtist,
  getArtistById,
  getArtistsByFilter,
  addArtist,
  getLeaderboard,
  addLeaderboardEntry,
} from './databasecontroller.js';

const router = express.Router();

router.get('/artists', (req, res) => {
  try {
    const artists = getArtistsByFilter(req.query);
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve artists' });
  }
});

router.get('/artists/:id', (req, res) => {
  try {
    const artist = getArtistById(req.params.id);

    if (artist) {
      res.status(200).json(artist);
      return;
    }

    res.status(404).json({ error: 'Artist not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve artist' });
  }
});

router.post('/artists', (req, res) => {
  try {
    const newArtist = addArtist(req.body);
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add artist' });
  }
});

router.get('/leaderboard', (req, res) => {
  try {
    const leaderboard = getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve leaderboard' });
  }
});

router.post('/leaderboard', (req, res) => {
  try {
    const newEntry = addLeaderboardEntry(req.body);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add leaderboard entry' });
  }
});

export default router;
