import {API_KEY} from './config';

const genres = {
    12: 'Пригоди',
    14: 'Фентезі',
    16: 'Мульт',
    18: 'Драма',
    27: 'Жахи',
    28: 'Дія',
    35: 'Комедія',
    36: 'Історичний',
    37: 'Вестерн',
    53: 'Триллер',
    80: 'Злочин',
    99: 'Документальний',
    878: 'Наука',
    9648: 'Загадковий',
    10402: 'Музичний',
    10749: 'Мило',
    10751: 'Сімейний',
    10752: 'Війна',
    10770: 'Телевізійний',
};

const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=uk-UA&sort_by=popularity.desc`;
const getImagePath = (path) =>
    `https://image.tmdb.org/t/p/w440_and_h660_face${path}`;
const getBackdropPath = (path) =>
    `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;

export const getMovies = async () => {
    const { results } = await fetch(API_URL).then((x) => x.json());
    return results.map(
        ({
             id,
             title,
             original_title,
             poster_path,
             backdrop_path,
             vote_average,
             overview,
             release_date,
             genre_ids,
         }) => ({
            key: String(id),
            title: title,
            original_title: original_title,
            poster: getImagePath(poster_path),
            backdrop: getBackdropPath(backdrop_path),
            rating: vote_average,
            description: overview,
            releaseDate: release_date,
            genres: genre_ids.map((genre) => genres[genre]),
        })
    );
};
