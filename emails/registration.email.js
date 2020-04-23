module.exports = (to, baseUrl) => ({
  to,
  from: process.env.EMAIL_FROM,
  subject: 'Welcome to EduShop! Confirm Your Email',
  html: `
    <h1>You're on your way!</h1>
    <p>Thanks for signing up for <a href="${baseUrl}">EduShop</a>!</p>
  `
})
