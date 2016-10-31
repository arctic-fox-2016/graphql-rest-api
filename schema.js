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

mongoose.connect('mongodb://localhost:27017/test_trygraphqldb', function(err){
  if(err){
    console.log(err)
  } else {
    console.log('MongoDB Connected')
  }
})

let UserType = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'ID User'
    },
    name: {
      type: GraphQLString,
      description: 'Name of user'
    },
    age: {
      type: GraphQLInt,
      description: 'Age of user'
    }
  })
})

let getAll = () => {
  return new Promise((resolve, reject) => {
    User.find((err, users) => {
      if(err) reject(err)
      else resolve(users)
    })
  })
}

let QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: () => {
        return getAll()
      }
    }
  })
})

let MutationAdd = {
  type: UserType,
  description: 'Add an user',
  args: {
    name: {
      name: 'Name from user',
      type: new GraphQLNonNull(GraphQLString)
    },
    age: {
      name: 'Age from user',
      type: GraphQLInt
    }
  },
  resolve: (root, args) => {
    let newUser = new User({
      name: args.name,
      age: args.age
    })
    newUser.id = newUser._id
    return new Promise((resolve, reject) => {
      newUser.save(function(err){
        if(err) reject(err)
        else resolve(newUser)
      })
    })
  }
}

let MutationEdit = {
  type: UserType,
  description: 'Edit an user',
  args: {
    id: {
      name: 'ID from user',
      type: new GraphQLNonNull(GraphQLString)
    },
    name: {
      name: 'Name from user',
      type: new GraphQLNonNull(GraphQLString)
    },
    age: {
      name: 'Age from user',
      type: GraphQLInt
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      User.findById(args.id, (err, user) => {
        if(err) reject(err)
        else if(!user) reject('User not found')
        else {
          user.name = args.name
          user.age = args.age
          user.save(function(err){
            if(err) reject(err)
            else resolve(user)
          })
        }
      })
    })
  }
}

let MutationDelete = {
  type: UserType,
  description: 'Delete an user',
  args: {
    id: {
      name: 'ID from user',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root, args) => {
    return new Promise((resolve, reject) => {
      User.findById(args.id, (err, user) => {
        if(err) reject(err)
        else if(!user) reject('User not found')
        else {
          user.remove((err) => {
            if(err) reject(err)
            else resolve(user)
          })
        }
      })
    })
  }
}

let MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd,
    edit: MutationEdit,
    delete: MutationDelete
  }
})

let schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})

export default schema
