export const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://next-mongo-crud-jade.vercel.app/api'
    : 'http://localhost:3000/api';
