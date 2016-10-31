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


let MutationDelete = {
  type: UserType,
  description: 'delete a user',
  args: {
    id:{
      name: 'ID dari User',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve: (root,args) => {
    return new Promise((resolve,reject) => {
      User.findById(args.id,(err,user) =>{
        if(err){
          reject(err)
        }else if(!user){
          reject('user Not Found')
        }else{
          user.remove((err)=>{
            if(err){
              reject(err)
            }
            else{
              resolve(user)
            }
          })
        }
      })
    })
  }
}

let MutationEdit = {
  type: UserType,
  description: 'edit a user',
  args: {
    id:{
      name: 'ID dari User',
      type: new GraphQLNonNull(GraphQLString)
    },
    name:{
      name:'Name',
      type: new GraphQLNonNull(GraphQLString)
    },
    age:{
      age:'Age',
      type: GraphQLInt
    }
  },
  resolve: (root,args) => {
    return new Promise((resolve,reject) => {
      User.findById(args.id,(err,user) =>{
        if(err){
          reject(err)
        }else if(!user){
          reject('user Not Found')
        }else{
          user.name = args.name
          user.age = args.age
          user.save(function(err){
            if(err)reject(err)
            resolve(user)
          })
        }
      })
    })
  }
}


let MutationAdd = {
  type: UserType,
  description: 'add a user',
  args: {
    name:{
      name: 'ARI',
      type: new GraphQLNonNull(GraphQLString)
    },
    age:{
      name:'26',
      type:GraphQLInt
    }
  },
  resolve: (root,args) => {
    let newUser = new User({
      name:args.name,
      age:args.age
    })
    newUser.id = newUser._id
    return new Promise((resolve,reject)=>{
      newUser.save(function(err){
        if(err){
          reject(err)
        }else{
          resolve(newUser)
        }
      })
    })
  }
}

let MutationType = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    add:MutationAdd,
    delete:MutationDelete,
    edit:MutationEdit
  }
})

let schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})
export default schema

//query{users{id name age}}
//mutation{delete(id:"5816c04d8660c50902f8b1f3"){name age id}}
//mutation{add(name:"IVAN",age:90){name age id}}
//mutation{edit(id:"5816c0e38660c50902f8b1f4",name:"IVANKURANG",age:80){name age id}}
