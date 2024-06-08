const User = require('../models/user');

module.exports = {
    show,
    editUsername,
    updateUsername
};

function show(req, res) {
    res.render('accounts/show', { title: 'My Account', user: req.user });
}

function editUsername(req, res) {
    res.render('accounts/editUsername', { title: 'Edit Username', user: req.user, error: null, username: req.user.username });
}

async function updateUsername(req, res) {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
            return res.render('accounts/editUsername', { title: 'Edit Username', user: req.user, error: 'Username is already taken', username: req.body.username });
        }
        const user = await User.findById(req.user._id);
        user.username = req.body.username;
        await user.save();
        res.redirect('/accounts');
    } catch (err) {
        res.status(500).send(err.message);
    }
}
