const express = require('express');
const { loginUser } = require('../controllers/authController'); 
const { createLoginUser } = require('../controllers/userController'); 
const router = express.Router();

router.post('/login', loginUser);  
router.post('/create-login', createLoginUser);  

module.exports = router;
