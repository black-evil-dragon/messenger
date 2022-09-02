const Routes = require('../server');

module.exports = function (app) {
    app.get('/', Routes.homePage)
        .get('/users', Routes.getUsers)
        .get('/api/invite', Routes.inviteUser)

        .post('/api/signup', Routes.SignUp)
        .post('/api/signin', Routes.SignIn)
        .post('/api/logout', Routes.logout)

        .post('/api/refresh', Routes.refresh)
        .post('/api/auth', Routes.authUser)
        .post('/api/update/data', Routes.updateData)

        .post('/api/acceptInvite', Routes.acceptInvite)
        .post('/api/delete/notice', Routes.deleteNotice)

        .post('/api/delete/contact', Routes.deleteContact)

        .post('/api/chat/create', Routes.createChat)
        .post('/api/chat/delete', Routes.createChat)
}

