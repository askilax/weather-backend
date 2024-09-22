var express = require('express');
var router = express.Router();
bcrypt = require('bcrypt');
const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');

router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;

    if (!checkBody(req.body, ['name', 'email', 'password'])) {
        return res.json({ result: false, error: 'Missing or empty fields' });
    }

    name = name.toLowerCase();
    email = email.toLowerCase();

    User.findOne({ email })
        .then((existUser) => {
            if (existUser) {
                return res.json({ result: false, error: 'User already exists' });
            }
            return bcrypt.hash(password, 10);
        })
        .then((hashedPass) => {
            if (!hashedPass) return;
            const newUser = new User({
                name,
                email,
                password: hashedPass,
            });
            return newUser.save();
        })
        .then(() => res.json({ result: true, message: `${name} registered successfully.` }))
        .catch((error) => res.status(500).json({ result: false, message: 'Server error', error }));
});


router.post('/signin', (req, res) => {
    if (!checkBody(req.body, ['email', 'password'])) {
        return res.json({ result: false, error: 'Missing or empty fields' });
    }
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.json({ result: false, error: 'User not found' });
        }
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
            if (!isMatch) {
                return res.json({ result: false, error: 'Incorrect password' });
            }
            return res.json({ result: true, message: `${user.email} connection successful.` });
        });
    }).catch((error) => {
        res.status(500).json({ result: false, message: 'Server error', error });
    });
});


module.exports = router;
