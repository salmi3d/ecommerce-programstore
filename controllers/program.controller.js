const Program = require('../models/program.model')

module.exports = class ProgramController {

  static async showAllProgramsPage(req, res) {
    try {
      const programs = await Program.find().populate('userId', 'name').lean()
      res.render('programs', {
        title: 'All programs',
        isPrograms: true,
        programs
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static showNewProgramPage(req, res) {
    res.render('new_program', {
      title: 'Add program',
      isNewProgram: true
    })
  }

  static async addProgram(req, res) {
    try {
      const { title, price, img } = req.body
      const program = new Program({
        title,
        price,
        img,
        userId: req.user
      })
      await program.save()
      res.redirect('/programs')
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async editProgram(req, res) {
    try {
      const { id } = req.body
      delete req.body.id
      await Program.findByIdAndUpdate(id, req.body).lean()
      res.redirect('/programs')
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async removeProgram(req, res) {
    try {
      const { id: _id } = req.body
      await Program.deleteOne({ _id })
      res.redirect('/programs')
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async showProgramPage(req, res) {
    try {
      const program = await Program.findById(req.params.id).lean()
      res.render('details_program', {
        layout: 'empty',
        title: `${program.title} :: Program details`,
        program
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async showEditProgramPage(req, res) {
    try {
      const program = await Program.findById(req.params.id).lean()
      res.render('edit_program', {
        title: `${program.title} :: Edit Program`,
        program
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

}
