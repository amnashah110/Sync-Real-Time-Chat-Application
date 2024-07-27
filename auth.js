const express = require('express');
const passport = require('passport');
const router = express.Router();

// Auth error route
router.get('/error', (req, res) => res.send('Unknown Error'));

// GitHub auth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/auth/error' }),
    function (req, res) {
        res.redirect('/room');
    });

module.exports = router;
