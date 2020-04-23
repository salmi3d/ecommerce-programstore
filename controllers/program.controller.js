const { validationResult } = require('express-validator')
const Program = require('../models/program.model')

module.exports = class ProgramController {

  static async showAllProgramsPage(req, res) {
    try {
      const programs = await Program.find().populate('userId', 'name').lean()
      res.render('programs', {
        title: 'All programs',
        isPrograms: true,
        userId: req.user ? req.user._id.toString() : null,
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
    const { title, price, img } = req.body
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(422).render('new_program', {
        title: 'Add program',
        isNewProgram: true,
        error: result.errors[0].msg || 'Incorrect data',
        data: { title, price, img }
      })
    }
    try {
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
    const { id } = req.body
    const result = validationResult(req)
    if (!result.isEmpty()) {
      req.flash('error', result.errors[0].msg || 'Incorrect data')
      return res.status(422).redirect(`/programs/edit/${id}`)
    }
    try {
      const program = await Program.findById(id)
      if (!ProgramController.isProgramOwner(program, req)) {
        return res.redirect('/programs')
      }
      delete req.body.id
      Object.assign(program, req.body)
      await program.save()
      res.redirect('/programs')
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static async removeProgram(req, res) {
    try {
      const { id: _id } = req.body
      await Program.deleteOne({ _id, userId: req.user._id })
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
      if (!ProgramController.isProgramOwner(program, req)) {
        return res.redirect('/programs')
      }
      res.render('edit_program', {
        title: `${program.title} :: Edit Program`,
        error: req.flash('error'),
        program
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: e })
    }
  }

  static isProgramOwner(program, req) {
    return program.userId.toString() === req.user._id.toString()
  }

}
