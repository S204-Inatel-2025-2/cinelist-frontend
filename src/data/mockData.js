// src/data/mockData.js
export const mockMovies = [
  {
    id: 1,
    title: "O Senhor dos Anéis",
    overview: "Um hobbit parte em uma jornada para destruir um anel maligno.",
    release_date: "2001-12-19",
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    rating: 9.0,
  },
];

export const mockAnimes = [
  {
    id: 2,
    title: "Attack on Titan",
    description: "Humanidade luta contra titãs gigantes.",
    score: 9.5,
    release_date: "2013-04-06",
    episodes: 87,
    status: "Finalizado",
  },
];

export const mockSeries = [
  {
    id: 3,
    title: "Breaking Bad",
    overview: "Professor de química vira produtor de metanfetamina.",
    release_date: "2008-01-20",
    creator: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul"],
    rating: 9.7,
    episodes: 62,
    status: "Finalizada",
    last_episode: "2013-09-29",
  },
];

export const mockComments = {
  1: [
    { user: "João", text: "Filme incrível!", rating: 9.7 },
    { user: "Maria", text: "Melhor trilogia já feita.", rating: 8.9 },
  ],
  2: [
    { user: "Carlos", text: "Obra-prima dos animes.", rating: 10 },
    { user: "Ana", text: "Ansioso pelo final 🔥", rating: 9.8 },
  ],
  3: [
    { user: "Lucas", text: "Breaking Bad é perfeito!", rating: 10 },
    { user: "Fernanda", text: "Say my name.", rating: 9.8 },
  ],
};