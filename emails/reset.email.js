module.exports = (to, token, baseUrl) => ({
  to,
  from: process.env.EMAIL_FROM,
  subject: 'Reset password',
  html: `
    <h1>Resetting password for EduShop!</h1>
    <p>If you forgot your password, please click on <a href="${baseUrl}/auth/password/${token}">this link</a>!</p>
  `
})
