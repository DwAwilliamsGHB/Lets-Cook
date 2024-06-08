const User = require('../models/user');

module.exports = {
    showUsernameForm,
    createUsername
};

function showUsernameForm(req, res) {
    res.render('users/username', { title: 'Create Username', error: null, username: '' });
}

async function createUsername(req, res) {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.render('users/username', { title: 'Create Username', error: 'Username is already taken', username: req.body.username });
        }
        const user = await User.findById(req.user._id);
        user.username = req.body.username;
        await user.save();
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
}
