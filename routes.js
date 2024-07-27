const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('./models/user');
const bcrypt = require('bcrypt');
require('./passport');

// Route for homepage
router.get('/', (req, res) => {
    const showPassword = false;
    const registration = false;
    const messages = {
        error: req.flash('error') 
    };
    res.render('home', { showPassword, registration, messages });
});


// Route for registration page
router.get('/register', (req, res) => {
    const showPassword = false;
    const registration = true;
    res.render('home', { showPassword, registration });
});

router.post('/', passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Incorrect Username or Password'}), (req, res) => {
    res.redirect('/room');
});

// Handle registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error registering new user.');
    }
});

// Route for chatroom (GET)
router.get('/room', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    const username = req.user.username;
    res.render('chatroom', { username });
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });

module.exports = router;
