"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const index_1 = __importDefault(require("./schema/index"));
const index_2 = __importDefault(require("./models/index"));
const app = (0, express_1.default)();
const port = 3000;
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({
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
    .catch(err => {
    console.log('Cannot connect to the database!', err);
    process.exit(1);
});
