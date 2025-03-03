const express = require('express');
const router = express.Router();

router.use('/hotel', require("./hotel"))
router.use('/user', require("./user"))
router.use('/menu', require("./menu"))
router.use('/roles', require("./roles"))
router.use('/invitation', require("./invitation"))
router.use('/pageAccess', require("./pageAccess"))
router.use('/image', require("./image"))
router.use('/tables', require("./tables"))
router.use('/rooms', require("./rooms"))
router.use('/cart', require("./cart"))
router.use('/payment', require("./payment"))
router.use('/redirect', require("./redirect"))
router.use('/order', require("./order"))

module.exports = router;
