module.exports = class IndexController {

  static showIndexPage(req, res) {
    res.render('index', {
      title: 'Home page',
      isIndex: true
    })
  }

}
