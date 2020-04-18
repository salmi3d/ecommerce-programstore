module.exports = to => ({
  to,
  from: process.env.EMAIL_FROM,
  subject: 'Welcome to EduShop! Confirm Your Email',
  html: `
    <h1>You're on your way!</h1>
    <p>Thanks for signing up for <a href="${process.env.BASE_URL}">EduShop</a>!</p>
  `
})
