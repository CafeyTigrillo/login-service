const { LoginUser } = require('../models/authModel');

exports.createLoginUser = async (req, res) => {
  try {
    const { user_id, username, password } = req.body;

    const existingLogin = await LoginUser.findOne({ where: { user_id } });
    if (existingLogin) {
      return res.status(400).json({ message: 'User credentials already exist.' });
    }

    const newLogin = await LoginUser.create({
      user_id,
      username,
      password,
    });

    res.status(201).json({ message: 'Login credentials created successfully.', login: newLogin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
