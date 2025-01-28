const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { LoginUser } = require('../models/authModel');

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await LoginUser.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username }, 
      process.env.JWT_SECRET || 'default_secret', 
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token: token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
