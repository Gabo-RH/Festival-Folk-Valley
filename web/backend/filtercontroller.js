import { getArtistsByFilter } from './databasecontroller.js';

export const filterArtistsByName = (name) => getArtistsByFilter({ name });
export const filterArtistsByGenre = (genre) => getArtistsByFilter({ genre });
export const filterArtistsByStage = (stage) => getArtistsByFilter({ stage });

export default {
  filterArtistsByName,
  filterArtistsByGenre,
  filterArtistsByStage,
};
