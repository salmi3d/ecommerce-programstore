const router = new require('express').Router()
const programCtrl = require('../controllers/program.controller')

router.get('/', programCtrl.showAllProgramsPage)
router.route('/new')
  .get(programCtrl.showNewProgramPage)
  .post(programCtrl.addProgram)
router.get('/:id', programCtrl.showProgramPage)
router.route('/edit/:id')
  .get(programCtrl.showEditProgramPage)
  .post(programCtrl.editProgram)
router.post('/remove', programCtrl.removeProgram)

module.exports = router
