// 'user strict'
// import mongoose from 'mongoose'
// import {
//   GraphQLObjectType,
//   GraphQLID,
//   GraphQLSchema,
//   GraphQLNonNull,
//   GraphQLList,
//   GraphQLString,
//   GraphQLInt,
// } from 'graphql'
//
// let User = mongoose.model('User',{
//     id:mongoose.Schema.Types.ObjectId,
//     name:String,
//     age:Number
// })
//
// mongoose.connect('mongodb://localhost/graphqldb',function(err){
//   if (err){
//     console.log(err);
//   }else {
//     console.log('mongodb connected');
//   }
// })
//
//
// let UserType = new GraphQLObjectType({
//   name:'user',
//   fields:() => ({
//     id: {
//       type: GraphQLID,
//       description: 'ID User'
//     },
//     name:{
//       type: GraphQLString,
//       description: 'name of user`'
//     },
//     age:{
//       type: GraphQLInt,
//       description: 'age of user`'
//     }
//   })
// })
//
// let getAll = () => {
//   return new Promise
// }
// let QueryType = new GraphQLObjectType({
//   name: 'Query',
//   fields:() => ({
//     users:{
//       type:new GraphQLList(UserType),
//       resolve:() => {
//         return getAll()
//       }
//     }
//   })
// })
// let MutationAdd = {
//     type: UserType,
//     description: 'add a user',
//     args: {
//       name:{
//         name: "nama",
//         type: new GraphQLSchema(GraphQLString)
//       },
//       age: {
//         name: 'umur dari user',
//         type: GraphQLInt
//       }
//     },
//     resolve: (root,args) => {
//       let newUser = new User({
//         name: args.name,
//         age: args.age
//       })
//       new User.id = newUser._id
//       return new Promise((resolve,reject) => {
//         newUser.save(function (err) {
//           if(err){
//             reject(err)
//           }else{
//             resolve(newUser)
//           }
//         })
//       })
//     }
// }
//
// let MutationType = new GraphQLObjectType({
//   name: 'mutation',
//   fields: {
//     add: MutationAdd
//   }
// })
// let schema = new GraphQLSchema({
//   query: QueryType,
//   mutation: MutationType
// })
// // export default schema
