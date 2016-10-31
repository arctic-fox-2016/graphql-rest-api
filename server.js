import express from 'express'
import schema from './schema.js'
import {graphql} from 'graphql'
import GraphQLHTTP from 'express-graphql'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser())

app.get('/', (req,res)=>{
  let query = '{users {name age id}}'
  graphql(schema, query).then((result) =>{
    res.json(result)
  })
})

app.post('/', (req,res)=>{
  let query = `mutation { add(name: "${req.body.name}", age: ${req.body.age}){name id age}}`
  graphql(schema, query).then((result)=>{
    res.json(result)
  })
})

app.delete('/', (req,res)=>{
  let query = `mutation { delete(id:"${req.body.id}"){name id age}}`
  graphql(schema, query).then((result)=>{
    res.json(result)
  })
})

app.put('/', (req,res)=>{
  let query = `mutation { edit(id:"${req.body.id}", name: "${req.body.name}", age: ${req.body.age}){name id age}}`
  graphql(schema, query).then((result)=>{
    res.json(result)
  })
})

app.use('/graphql', GraphQLHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}))

app.listen(3000, (err)=>{
  if(err){
    console.log(err)
  }
  console.log('server is running')
})
