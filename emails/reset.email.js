module.exports = (to, token) => ({
  to,
  from: process.env.EMAIL_FROM,
  subject: 'Reset password',
  html: `
    <h1>Resetting password for EduShop!</h1>
    <p>If you forgot your password, please click on <a href="${process.env.BASE_URL}/auth/password/${token}">this link</a>!</p>
  `
})
