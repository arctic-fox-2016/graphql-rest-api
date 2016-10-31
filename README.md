### Try graphql

#### GraphQL Query for get all users

```
query{
  users{
    id
    name
    age
  }
}
```

#### GraphQL Query for add data

```
mutation{
  add(name: "John Doe", age: 18){
    id
    name
    age
  }
}
```

#### GraphQL Query for edit data

```
mutation{
  edit(id: "5816caa96a25e42c3038abdc", name: "John Wick", age: 20){
    id
    name
    age
  }
}
```

#### GraphQL Query for delete data

```
mutation{
  delete(id: "5816caa96a25e42c3038abdc"){
    id
    name
    age
  }
}
```
