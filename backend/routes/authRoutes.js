const express = require('express');
const router = express.Router();
const {
  createUser,
  findByEmail,
  findById,
  findByUsername,
  updateUser,
  updatePassword,
  comparePassword
} = require('../models/userModel');
const { generateToken, authenticateToken } = require('../middleware/auth');

router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const existingEmail = await findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    const existingUsername = await findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ message: 'Username already taken' });
    }
    
    const user = await createUser({ email, username, password, role: 'contributor' });
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'Registration successful',
      user,
      token
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { email, username } = req.body;
    const userId = req.user.id;
    
    if (email) {
      const existingEmail = await findByEmail(email);
      if (existingEmail && existingEmail.id !== userId) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }
    
    if (username) {
      const existingUsername = await findByUsername(username);
      if (existingUsername && existingUsername.id !== userId) {
        return res.status(409).json({ message: 'Username already taken' });
      }
    }
    
    const updatedUser = await updateUser(userId, { email, username });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

router.put('/password', authenticateToken, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    const user = await findByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    await updatePassword(userId, newPassword);
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
