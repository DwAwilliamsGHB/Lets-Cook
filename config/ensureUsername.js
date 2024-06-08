module.exports = function ensureUsername(req, res, next) {
    if (req.isAuthenticated() && !req.user.username && req.path !== '/username' && req.path !== '/username') {
        return res.redirect('/username');
    }
    next();
};
