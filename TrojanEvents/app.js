const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const cors = require("cors");
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');



const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.json());
app.use(isAuth);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect(`mongodb+srv://mainUser:S5GTGKxDzMFsjK7I@cluster0.mfaks3m.mongodb.net/events-react-dev?retryWrites=true&w=majority`).then(
()=>{
app.listen(8000);
}
).catch(err=>{
    console.log(err);
});

