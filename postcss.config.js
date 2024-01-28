module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview"
      ? { cssnano: {} }
      : {}),
  },
};
