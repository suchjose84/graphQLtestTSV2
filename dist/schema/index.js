"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const User = models_1.default.users;
const Inventory = models_1.default.inventory;
const graphql_1 = require("graphql");
const validation_schema_1 = require("../util/validation_schema");
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: () => ({
        username: { type: graphql_1.GraphQLString },
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        password: { type: graphql_1.GraphQLString },
        birthDate: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
        country: { type: graphql_1.GraphQLString },
        profileImg: { type: graphql_1.GraphQLString },
        inventory: {
            type: new graphql_1.GraphQLList(InventoryType),
            resolve(parent, args) {
                return Inventory.find({ username: parent.username });
            }
        }
    })
});
const InventoryType = new graphql_1.GraphQLObjectType({
    name: 'Inventory',
    fields: () => ({
        username: { type: graphql_1.GraphQLString },
        itemName: { type: graphql_1.GraphQLString },
        price: { type: graphql_1.GraphQLString },
        classification: { type: graphql_1.GraphQLString },
        remaining: { type: graphql_1.GraphQLString },
        unit: { type: graphql_1.GraphQLString },
        userInfo: {
            type: new graphql_1.GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({ username: parent.username });
            }
        }
    })
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        users: {
            type: new graphql_1.GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            },
        },
        user: {
            type: UserType,
            args: {
                id: {
                    type: graphql_1.GraphQLID
                },
                username: {
                    type: graphql_1.GraphQLString
                }, // Add this argument for querying by username
            },
            resolve(parent, args) {
                if (args.id) {
                    // Querying by ID
                    return User.findById(args.id);
                }
                else if (args.username) {
                    // Querying by username
                    return User.findOne({
                        username: args.username
                    });
                }
                else {
                    // Handle error or default case
                    throw new Error('Invalid arguments for user query.');
                }
            },
        },
        inventory: {
            type: new graphql_1.GraphQLList(InventoryType),
            resolve(parent, args) {
                return Inventory.find({});
            },
        },
        itemById: {
            type: InventoryType,
            args: { id: { type: graphql_1.GraphQLID } },
            async resolve(parent, args) {
                try {
                    const item = await Inventory.findOne({ _id: args.id }).exec();
                    if (!item) {
                        throw new graphql_1.GraphQLError('Item not found', null, null, null, null, null, { statusCode: '404' });
                    }
                    return { ...item.toObject(), statusCode: '200' };
                }
                catch (err) {
                    throw new graphql_1.GraphQLError('Error retrieving item', null, null, null, null, null, {
                        extensions: { statusCode: '404' }
                    });
                }
            }
        },
        searchItems: {
            type: new graphql_1.GraphQLList(InventoryType),
            args: {
                usernames: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
                classifications: { type: new graphql_1.GraphQLList(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                const query = {};
                if (args.usernames && args.usernames.length > 0) {
                    query.username = { $in: args.usernames };
                }
                if (args.classifications && args.classifications.length > 0) {
                    query.classification = { $in: args.classifications };
                }
                // Sort by classification in ascending order
                return Inventory.find(query)
                    .sort({ username: 1 })
                    .then((items) => {
                    if (items.length === 0) {
                        throw new graphql_1.GraphQLError('No items found for the provided criteria', null, null, null, null, null, {
                            statusCode: '404'
                        });
                    }
                    return items;
                })
                    .catch((error) => {
                    throw new graphql_1.GraphQLError(`Error retrieving items: ${error.message}`, null, null, null, [error]);
                });
            }
        }
    }
});
const RootMutation = new graphql_1.GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                },
                firstName: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                },
                lastName: {
                    type: graphql_1.GraphQLString,
                },
                email: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                },
                password: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
                },
                birthDate: {
                    type: graphql_1.GraphQLString,
                },
                phone: {
                    type: graphql_1.GraphQLString,
                },
                country: {
                    type: graphql_1.GraphQLString,
                },
                profileImg: {
                    type: graphql_1.GraphQLString,
                },
            },
            async resolve(parent, args) {
                try {
                    await validation_schema_1.usernameSchema.validateAsync(args.username);
                    await validation_schema_1.emailSchema.validateAsync(args.email);
                    await validation_schema_1.passwordSchema.validateAsync(args.password);
                    const existingUser = await User.findOne({
                        $or: [
                            { username: args.username },
                            { email: args.email },
                        ],
                    });
                    if (existingUser) {
                        throw new Error('Username or email already exists.');
                    }
                    let user = new User({
                        username: args.username,
                        firstName: args.firstName,
                        lastName: args.lastName,
                        email: args.email,
                        password: args.password,
                        birthDate: args.birthDate,
                        phone: args.phone,
                        country: args.country,
                        profileImg: args.profileImg,
                    });
                    return user.save();
                }
                catch (error) {
                    throw new graphql_1.GraphQLError(error.message);
                }
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                username: { type: graphql_1.GraphQLString },
                firstName: { type: graphql_1.GraphQLString },
                lastName: { type: graphql_1.GraphQLString },
                email: { type: graphql_1.GraphQLString },
                password: { type: graphql_1.GraphQLString },
                birthDate: { type: graphql_1.GraphQLString },
                phone: { type: graphql_1.GraphQLString },
                country: { type: graphql_1.GraphQLString },
                profileImg: { type: graphql_1.GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    const { id, ...updateData } = args;
                    if (args.username) {
                        await validation_schema_1.usernameSchema.validateAsync(args.username);
                    }
                    if (args.email) {
                        await validation_schema_1.emailSchema.validateAsync(args.email);
                    }
                    if (args.password) {
                        await validation_schema_1.passwordSchema.validateAsync(args.password);
                    }
                    const existingUser = await User.findOne({
                        _id: { $ne: id },
                        $or: [
                            { username: args.username },
                            { email: args.email },
                        ],
                    });
                    if (existingUser) {
                        throw new Error('Username or email already exists.');
                    }
                    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
                    if (!updatedUser) {
                        throw new Error('User not found.');
                    }
                    return updatedUser;
                }
                catch (error) {
                    throw new graphql_1.GraphQLError(error.message);
                }
            },
        },
        deleteUser: {
            type: UserType,
            args: {
                username: {
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString)
                },
                id: {
                    type: graphql_1.GraphQLID
                },
            },
            async resolve(parent, args) {
                try {
                    if (args.id) {
                        // If `id` is provided, delete user by ID
                        const deletedUser = await User.findByIdAndDelete(args.id);
                        if (!deletedUser) {
                            throw new Error('User with the provided ID does not exist.');
                        }
                        return deletedUser;
                    }
                    else {
                        // Delete user by username
                        const deletedUser = await User.findOneAndDelete({
                            username: args.username
                        });
                        if (!deletedUser) {
                            throw new Error('User with the provided username does not exist.');
                        }
                        return deletedUser;
                    }
                }
                catch (error) {
                    throw new graphql_1.GraphQLError(error.message);
                }
            },
        },
        // deleteUsers: {
        //   type: GraphQLString,
        //   args: {
        //     usernames: {
        //       type: new GraphQLList(GraphQLString),
        //     },
        //     ids: {
        //       type: new GraphQLList(GraphQLID)
        //     }
        //   },
        //   async resolve(parent, { usernames, ids }) {
        //     let deletedUsers: string[] = [];
        //     let failedDeletions: string[] = [];
        //     // Delete users based on usernames
        //     if (usernames && usernames.length > 0) {
        //       // Find the existing usernames in the database
        //       const existingUsernames = await User.find({
        //         username: { $in: usernames } as {$in: string[]}
        //       }).distinct('username');
        //       // Get the usernames that have a match in the database
        //       const usernamesToDelete = existingUsernames;
        //       // Get the invalid usernames that are not found in the database
        //       const invalidUsernames = usernames.filter(username => !existingUsernames.includes(username));
        //       // Delete the users with matching usernames
        //       const deleteResults = await User.deleteMany({
        //         username: { $in: usernamesToDelete }
        //       });
        //       // Check if any users were successfully deleted
        //       if (deleteResults && deleteResults.deletedCount > 0) {
        //         deletedUsers.push(deleteResults.deletedCount);
        //       } else {
        //         failedDeletions = failedDeletions.concat(usernamesToDelete);
        //       }
        //       // Add the invalid usernames to the failedDeletions array
        //       failedDeletions = failedDeletions.concat(invalidUsernames);
        //     }
        //     // Delete users based on IDs
        //     if (ids && ids.length > 0) {
        //       // Find the existing IDs in the database
        //       const existingIds = await User.find({
        //         _id: { $in: ids }
        //       }).distinct('_id');
        //       // Get the IDs that have a match in the database
        //       const idsToDelete = existingIds.map(id => id.toString());
        //       // Get the invalid IDs that are not found in the database
        //       const invalidIds = ids.filter(id => !existingIds.includes(id));
        //       // Delete the users with matching IDs
        //       const deleteResults = await User.deleteMany({
        //         _id: { $in: idsToDelete }
        //       });
        //       // Check if any users were successfully deleted
        //       if (deleteResults && deleteResults.deletedCount > 0) {
        //         deletedUsers.push(deleteResults.deletedCount);
        //       }
        //       // Find the IDs that failed to be deleted
        //       const failedIds = ids.filter(id => !idsToDelete.includes(id.toString()));
        //       // Add the failed IDs to the failedDeletions array
        //       failedDeletions = failedDeletions.concat(failedIds);
        //     }
        //     let responseMessage = "";
        //     if (deletedUsers.length > 0) {
        //       responseMessage = `Successfully deleted ${deletedUsers.reduce((a, b) => a + b, 0)} user(s).`;
        //     } else {
        //       responseMessage = "No users were deleted.";
        //     }
        //     if (failedDeletions.length > 0) {
        //       responseMessage += ` Failed to delete user(s) with the following IDs: ${failedDeletions.join(", ")}.`;
        //     } else {
        //       responseMessage += ` All users were deleted successfully.`;
        //     }
        //     return responseMessage;
        //   },
        // },
        deleteUsers: {
            type: graphql_1.GraphQLString,
            args: {
                usernames: {
                    type: new graphql_1.GraphQLList(graphql_1.GraphQLString),
                },
                ids: {
                    type: new graphql_1.GraphQLList(graphql_1.GraphQLID),
                },
            },
            async resolve(parent, { usernames, ids }) {
                let deletedUsers = [];
                let failedDeletions = [];
                // Delete users based on usernames
                if (usernames && usernames.length > 0) {
                    // Find the existing usernames in the database
                    const existingUsernames = await User.find({
                        username: { $in: usernames },
                    }).distinct('username');
                    // Get the usernames that have a match in the database
                    const usernamesToDelete = existingUsernames;
                    // Get the invalid usernames that are not found in the database
                    // const invalidUsernames: string[] = usernames.filter(username => !existingUsernames.includes(username));
                    const invalidUsernames = usernames.filter((username) => !existingUsernames.includes(username));
                    // Delete the users with matching usernames
                    const deleteResults = await User.deleteMany({
                        username: { $in: usernamesToDelete },
                    });
                    // Check if any users were successfully deleted
                    if (deleteResults && deleteResults.deletedCount) {
                        deletedUsers.push(deleteResults.deletedCount);
                    }
                    else {
                        failedDeletions = failedDeletions.concat(usernamesToDelete);
                    }
                    // Add the invalid usernames to the failedDeletions array
                    failedDeletions = failedDeletions.concat(invalidUsernames);
                }
                // Delete users based on IDs
                if (ids && ids.length > 0) {
                    // Find the existing IDs in the database
                    const existingIds = await User.find({
                        _id: { $in: ids },
                    }).distinct('_id');
                    // Get the IDs that have a match in the database
                    const idsToDelete = existingIds.map(id => id.toString());
                    // Get the invalid IDs that are not found in the database
                    const invalidIds = ids.filter((id) => !existingIds.includes(id.toString()));
                    // Delete the users with matching IDs
                    const deleteResults = await User.deleteMany({
                        _id: { $in: idsToDelete },
                    });
                    // Check if any users were successfully deleted
                    if (deleteResults && deleteResults.deletedCount) {
                        deletedUsers.push(deleteResults.deletedCount);
                    }
                    // Find the IDs that failed to be deleted
                    const failedIds = ids.filter((id) => !idsToDelete.includes(id.toString()));
                    // Add the failed IDs to the failedDeletions array
                    failedDeletions = failedDeletions.concat(failedIds);
                }
                let responseMessage = '';
                if (deletedUsers.length > 0) {
                    responseMessage = `Successfully deleted ${deletedUsers.reduce((a, b) => a + b, 0)} user(s).`;
                }
                else {
                    responseMessage = 'No users were deleted.';
                }
                if (deletedUsers.length > 0) {
                    responseMessage = `Successfully deleted ${deletedUsers.reduce((a, b) => a + b, 0)} user(s).`;
                }
                else {
                    responseMessage = "No users were deleted.";
                }
                if (failedDeletions.length > 0) {
                    responseMessage += ` Failed to delete user(s) with the following IDs: ${failedDeletions.join(", ")}.`;
                }
                else {
                    responseMessage += ` All users were deleted successfully.`;
                }
                return responseMessage;
            },
        },
        addItem: {
            type: InventoryType,
            args: {
                username: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
                itemName: { type: graphql_1.GraphQLString },
                price: { type: graphql_1.GraphQLString },
                classification: { type: graphql_1.GraphQLString },
                remaining: { type: graphql_1.GraphQLString },
                unit: { type: graphql_1.GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    // Check if the provided username exists in the database
                    const user = await User.findOne({ username: args.username });
                    if (!user) {
                        throw new Error('User not found');
                    }
                    const inventory = new Inventory({
                        username: args.username,
                        itemName: args.itemName,
                        price: args.price,
                        classification: args.classification,
                        remaining: args.remaining,
                        unit: args.unit,
                    });
                    const newItem = await inventory.save();
                    return newItem;
                }
                catch (error) {
                    throw new Error(`Failed to add item: ${error.message}`);
                }
            },
        },
        editItem: {
            type: InventoryType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
                itemName: { type: graphql_1.GraphQLString },
                price: { type: graphql_1.GraphQLString },
                classification: { type: graphql_1.GraphQLString },
                remaining: { type: graphql_1.GraphQLString },
                unit: { type: graphql_1.GraphQLString },
            },
            async resolve(parent, args) {
                const updateFields = {
                    itemName: args.itemName,
                    price: args.price,
                    classification: args.classification,
                    remaining: args.remaining,
                    unit: args.unit,
                };
                try {
                    const updatedItem = await Inventory.findByIdAndUpdate(args.id, updateFields, { new: true });
                    if (!updatedItem) {
                        throw new Error('Item not found');
                    }
                    return updatedItem;
                }
                catch (error) {
                    throw new Error(`Failed to update item: ${error.message}`);
                }
            },
        },
        deleteItem: {
            type: InventoryType,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
            },
            resolve(parent, args) {
                return Inventory.findById(args.id)
                    .then((item) => {
                    if (!item) {
                        throw new Error('Item with the provided ID does not exist.');
                    }
                    return Inventory.findByIdAndRemove(args.id)
                        .then(() => item)
                        .catch((err) => {
                        throw new Error('Failed to delete item');
                    });
                })
                    .catch((err) => {
                    throw new Error('Failed to retrieve item');
                });
            },
        },
        deleteAllItems: {
            type: graphql_1.GraphQLString,
            resolve(parent, args) {
                return Inventory.deleteMany({})
                    .then(() => 'All items deleted successfully')
                    .catch(err => {
                    throw new Error('Failed to delete all items');
                });
            },
        },
    },
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation
});
exports.default = schema;
// export { UserType, InventoryType };
