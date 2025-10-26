// src/config/avatars.js
export const AVATAR_MAP = {
  // O ID 'default' será o nosso fallback
  'default': '/avatars/img_avatar.png', 
  
  'avatar_1': '/avatars/anime_icon_1.png',
  'avatar_2': '/avatars/anime_icon_2.png',
  'avatar_3': '/avatars/anime_icon_3.png',
  'avatar_4': '/avatars/anime_icon_4.png',
  'avatar_5': '/avatars/movie_icon_1.jpg',
  'avatar_6': '/avatars/movie_icon_2.jpg',
  'avatar_7': '/avatars/movie_icon_3.jpg',
  'avatar_8': '/avatars/movie_icon_4.jpg',
  'avatar_9': '/avatars/serie_icon_1.jpg',
  'avatar_10': '/avatars/serie_icon_2.png',
  'avatar_11': '/avatars/serie_icon_3.png',
  'avatar_12': '/avatars/serie_icon_4.jpg',
  'avatar_13': '/avatars/chris_icon_1.jpg',
};

// Define qual ID é o padrão
export const DEFAULT_AVATAR_ID = 'default';

/**
 * Função auxiliar para obter o caminho da imagem (path) 
 * com base no ID salvo no banco de dados do usuário.
 * * @param {string} avatarId - O ID salvo no objeto user (ex: 'avatar_3')
 * @returns {string} O caminho para a imagem (ex: '/avatars/avatar2.png')
 */
export const getAvatarPath = (avatarId) => {
  // Se o ID existir no mapa, retorna o caminho dele.
  // Senão, retorna o caminho do avatar 'default'.
  return AVATAR_MAP[avatarId] || AVATAR_MAP[DEFAULT_AVATAR_ID];
};