import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/index';
import db from './models/index';
import { auth, requiresAuth } from 'express-openid-connect';
import config from './config/auth0.config.js';

//port
const port = process.env.PORT || 3000;

const app = express();

// Connect to auth0
app.use(auth(config));

app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // User is authenticated
    res.send('You are logged in! API doc is at https://graphqltesttsv2.onrender.com/graphql');
  } else {
    // User is not authenticated
    res.send('Welcome guest! Please login.');
  }
});

//Graphql
app.use(
  '/graphql',
  requiresAuth(),
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

db.mongoose
  .connect(db.url)
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to the database and server running on port ${port}.`);
    });
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit(1);
  });