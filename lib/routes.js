'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware'); 

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/kiwis/:email')
    .get(api.getKiwis);

  app.route('/api/groups/:uid/:groupRef')
    .get(api.getGroup);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  app.route('/api/createUser')
    .post(api.sendUser);

  app.route('/api/sentimentalise')
    .post(api.sentimentalise);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};