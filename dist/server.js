"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const index_1 = __importDefault(require("./schema/index"));
const index_2 = __importDefault(require("./models/index"));
const express_openid_connect_1 = require("express-openid-connect");
const auth0_config_js_1 = __importDefault(require("./config/auth0.config.js"));
//port
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Connect to auth0
app.use((0, express_openid_connect_1.auth)(auth0_config_js_1.default));
app.get('/', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        // User is authenticated
        res.send('You are logged in! API doc is at https://graphqltesttsv2.onrender.com/graphql');
    }
    else {
        // User is not authenticated
        res.send('Welcome guest! Please login.');
    }
});
//Graphql
app.use('/graphql', (0, express_openid_connect_1.requiresAuth)(), (0, express_graphql_1.graphqlHTTP)({
    schema: index_1.default,
    graphiql: true
}));
index_2.default.mongoose
    .connect(index_2.default.url)
    .then(() => {
    app.listen(port, () => {
        console.log(`Connected to the database and server running on port ${port}.`);
    });
})
    .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit(1);
});
