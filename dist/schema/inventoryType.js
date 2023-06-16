"use strict";
// import db from '../models';
// const User = db.users;
// import UserType from './usertype';
// import {
//     GraphQLObjectType,
//     GraphQLString,
//     GraphQLID,
//     GraphQLSchema,
//     GraphQLList,
//     GraphQLNonNull,
//     GraphQLError
//   } from 'graphql';
// const InventoryType = new GraphQLObjectType({
//     name: 'Inventory',
//     fields: () => ({
//       username: { type: GraphQLString },
//       itemName: { type: GraphQLString },
//       price: { type: GraphQLString },
//       classification: { type: GraphQLString },
//       remaining: { type: GraphQLString },
//       unit: { type: GraphQLString },
//       userInfo: {
//         type: new GraphQLList(UserType),
//         resolve(parent, args) {
//           return User.find({ username: parent.username });
//         }
//       }
//     })
//   });
//   export default InventoryType;
