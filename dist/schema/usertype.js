'use strict';
// import db from '../models';
// const Inventory = db.inventory;
// import InventoryType from './inventoryType';
// import {
//     GraphQLObjectType,
//     GraphQLString,
//     GraphQLID,
//     GraphQLSchema,
//     GraphQLList,
//     GraphQLNonNull,
//     GraphQLError
//   } from 'graphql';
// const UserType = new GraphQLObjectType({
//     name: 'User',
//     fields: () => ({
//       username: { type: GraphQLString },
//       firstName: { type: GraphQLString },
//       lastName: { type: GraphQLString },
//       email: { type: GraphQLString },
//       password: { type: GraphQLString },
//       birthDate: { type: GraphQLString },
//       phone: { type: GraphQLString },
//       country: { type: GraphQLString },
//       profileImg: { type: GraphQLString },
//       inventory: {
//         type: new GraphQLList(InventoryType),
//         resolve(parent, args) {
//           return Inventory.find({ username: parent.username });
//         }
//       }
//     })
//   });
//   export default UserType;
