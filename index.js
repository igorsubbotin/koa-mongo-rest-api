// A "closer to real-life" app example
// using 3rd party middleware modules
// P.S. MWs calls be refactored in many files

// long stack trace (+clarify from co) if needed
if (process.env.TRACE) {
  require('./libs/trace');
}

const Koa = require('koa');
const app = new Koa();

const config = require('config');

const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const handlers = fs.readdirSync(path.join(__dirname, 'handlers')).sort();
handlers.forEach(handler => require('./handlers/' + handler).init(app));

mongoose.set('debug', true);
mongoose.connect('mongodb://localhost/test');

const userSchema = require('./schemas/user-schema.js');
const User = mongoose.model('User', userSchema);

// can be split into files too
const Router = require('koa-router');

const router = new Router();

router.get('/users', async (ctx, next) => {
  const users = await User.find({});
  ctx.body = users;
});
 
router.get('/users/:id', async (ctx, next) => {
  const user = await User.find(
    {
      _id: ctx.params.id
    });
  ctx.body = user;
});

router.post('/users', async (ctx, next) => {
  const user = await User.create(
    {
      email: ctx.request.body.email,
      displayName: ctx.request.body.displayName
    });
  ctx.body = user.id;
});

router.patch('/users/:id', async (ctx, next) => {
  await User.update(
    {
      _id: ctx.params.id
    }, 
    {
      email: ctx.request.body.email,
      displayName: ctx.request.body.displayName
    });
});

router.delete('/users/:id', async (ctx, next) => {
  await User.remove(
    { 
      _id: ctx.params.id 
    });
  ctx.body = 'OK';
});

app.use(router.routes());

app.listen(config.get('port'));
