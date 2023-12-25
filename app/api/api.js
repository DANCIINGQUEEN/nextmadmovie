export const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://nextmadmovie.vercel.app/api'
    : 'http://localhost:3000/api';