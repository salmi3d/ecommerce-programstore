const Program = require('../models/Program')

module.exports = class RootController {

  static async showAllProgramsPage(req, res) {
    const programs = await Program.getAll()

    res.render('programs', {
      title: 'All programs',
      isPrograms: true,
      programs
    })
  }

  static showNewProgramPage(req, res) {
    res.render('new_program', {
      title: 'Add program',
      isNewProgram: true
    })
  }

  static async addProgram(req, res) {
    const { title, price, img } = req.body
    const program = new Program(title, price, img)
    await program.save()
    res.redirect('/programs')
  }

  static async editProgram(req, res) {
    await Program.update(req.body)
    res.redirect('/programs')
  }

  static async showProgramPage(req, res) {
    const program = await Program.getById(req.params.id)
    res.render('details_program', {
      layout: 'empty',
      title: `${program.title} :: Program details`,
      program
    })
  }

  static async showEditProgramPage(req, res) {
    const program = await Program.getById(req.params.id)
    res.render('edit_program', {
      title: `${program.title} :: Edit Program`,
      program
    })
  }

}
