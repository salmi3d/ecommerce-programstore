const router = new require('express').Router()
const programCtrl = require('../controllers/program.controller')
const auth = require('../middleware/auth.middleware')

router.get('/', programCtrl.showAllProgramsPage)
router.route('/new')
  .get(auth, programCtrl.showNewProgramPage)
  .post(auth, programCtrl.addProgram)
router.get('/:id', programCtrl.showProgramPage)
router.route('/edit/:id')
  .get(auth, programCtrl.showEditProgramPage)
  .post(auth, programCtrl.editProgram)
router.post('/remove', auth, programCtrl.removeProgram)

module.exports = router
