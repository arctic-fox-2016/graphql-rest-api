import mongoose from 'mongoose'
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} from 'graphql'

let User = mongoose.model('User', {
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  age: Number
})

mongoose.connect('localhost:27017/testing-graphql', function(err){
  if(err){
    console.log(err)
  } else {
    console.log('mongodb connected')
  }
})

let UserType = new GraphQLObjectType({
  name: 'user',
  fields: ()=>({
    id:{
      type: GraphQLID,
      description: 'ID User'
    },
    name: {
      type: GraphQLString,
      description: 'name of user'
    },
    age: {
      type: GraphQLInt,
      description: 'age of user'
    }
  })
})

let getAll = ()=> {
  return new Promise((resolve, reject)=> {
    User.find((err,users)=>{
      if(err){
        reject(err)
      } else {
        resolve(users)
      }
    })
  })
}

let QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: ()=> ({
    users: {
      type: new GraphQLList(UserType),
      resolve: ()=> {
        return getAll()
      }
    }
  })
})

let MutationAdd = {
  type: UserType,
  description: 'add a user',
  args: {
    name: {
      name: 'nama dari user',
      type: new GraphQLNonNull(GraphQLString)
    },
    age: {
      name: 'usia dari user',
      type: GraphQLInt
    }
  },
  resolve: (root, args)=>{
    let newUser = new User({
      name: args.name,
      age: args.age
    })
    newUser.id = newUser._id
    return new Promise((resolve, reject)=>{
      newUser.save(function(err){
        if(err){
          reject(err)
        } else {
          resolve(newUser)
        }
      })
    })
  }
}

let MutationDelete = {
  type: UserType,
  description: 'hilangkan a user',
  args: {
    id: {
      name: 'id dari user',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args)=>{
    return new Promise((resolve,reject)=>{
      User.findById(args.id, function(err,result){
        result.remove(function(err_remove, result_remove){
          if(err_remove){
            reject(err_remove)
          } else {
            resolve(result)
          }
        })
      })
    })
  }
}

let MutationEdit = {
  type: UserType,
  description: 'update user',
  args: {
    id: {
      name: 'id user',
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      name: 'nama user',
      type: GraphQLString
    },
    age: {
      name: 'usia user',
      type: GraphQLInt
    }
  },
  resolve(root,args){
    return new Promise((resolve, reject)=>{
      User.findById(args.id, (err,user)=>{
        user.name = args.name
        user.age = args.age
        user.save(function(err){
          if(err){
            reject(err)
          } else {
            resolve(user)
          }
        })
      })
    })
  }
}

let MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    delete: MutationDelete,
    edit: MutationEdit
  }
})

let schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})

export default schema
