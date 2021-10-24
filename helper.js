import mongodb from "mongodb";

export async function insertUser(client, user) {
  const result = await client.db("myrecipe").collection("user").insertOne(user);
  console.log("successfully pass inserted", result);
  return result;
}

export async function getUser(client, filter) {
  const result = await client.db("myrecipe").collection("user").findOne(filter);
  console.log("successfully matched", result);
  return result;
}

export async function updateUser(client, _id, password) {
  const result = await client
    .db("myrecipe")
    .collection("user")
    .updateOne(
      { _id: new mongodb.ObjectId(_id) },
      { $set: { password: password } }
    );
  console.log("successfully new password updated", result);
  return result;
}

export async function inserttoken(client, user) {
  const result = await client
    .db("myrecipe")
    .collection("tokens")
    .insertOne(user);
  console.log("successfully pass inserted", result);
  return result;
}

export async function gettoken(client, filter) {
  const result = await client
    .db("myrecipe")
    .collection("tokens")
    .findOne(filter);
  console.log("successfully matched", result);
  return result;
}

export async function deletetoken(client, tokenid) {
  const deletetokens = await client
    .db("myrecipe")
    .collection("tokens")
    .deleteOne({ tokenid: new mongodb.ObjectId(tokenid) });
  console.log("successfully token is deleted", deletetokens);
  return deletetokens;
}

export async function getAllRecipeData(client, filter) {
  const recipe = await client
    .db("myrecipe")
    .collection("list_recipes")
    .find(filter)
    .toArray();
  console.log("successfully all recipes are obtanied", recipe);
  return recipe;
}

export async function insertRecipeData(client, filter) {
  const recipe = await client
    .db("myrecipe")
    .collection("list_recipes")
    .insertOne(filter);
  console.log("successfully recipe are inserted", recipe);
  return recipe;
}

export async function getOneRecipeData(client, _id) {
  const result = await client
    .db("myrecipe")
    .collection("list_recipes")
    .findOne({ _id: new mongodb.ObjectId(_id) });
  console.log("successfully recipe obtained", result);
  return result;
}

export async function updateRecipedata(client, _id, filter) {
  const result = await client
    .db("myrecipe")
    .collection("list_recipes")
    .updateOne({ _id: new mongodb.ObjectId(_id) }, { $set: filter });
  console.log("successfully updated", result);
  return result;
}

export async function deleteRecipeData(client, _id) {
  const result = await client
    .db("myrecipe")
    .collection("list_recipes")
    .deleteOne({ _id: new mongodb.ObjectId(_id) });
  console.log("successfully recipe is deleted", result);
  return result;
}
