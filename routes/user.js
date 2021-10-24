import {
  getAllRecipeData,
  insertRecipeData,
  getOneRecipeData,
  deleteRecipeData,
  updateRecipedata,
  insertUser,
  getUser,
  updateUser,
  inserttoken,
  gettoken,
  deletetoken,
} from "../helper.js";
import { createConnection } from "../index.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import {sendEmail} from "../middleware/mail.js"
const router = express.Router();

router.route("/signup").post(async (request, response) => {
  const { email_id, firstname, lastname, password } = request.body;
  const client = await createConnection();
  const hashedPassword = await genPassword(password);
  const pass = await insertUser(client, {
    email_id: email_id,
    firstname: firstname,
    lastname: lastname,
    password: hashedPassword,
  });
  console.log(hashedPassword, pass);
  response.send({message:"successfully sign up as been done"});
});

router.route("/login").post(async (request, response) => {
  const { email_id, password } = request.body;
  const client = await createConnection();
  const user = await getUser(client, { email_id: email_id });
  if (!user) {
    response.send({ message: "user not exist ,please sign up" });
  } else {
    console.log(user._id);

    const inDbStoredPassword = user.password;
    const isMatch = await bcrypt.compare(password, inDbStoredPassword);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.KEY);

      response.send({
        message: "successfully login",
        token: token,
        email_id: email_id,
      });
    } else {
      response.send({ message: "invalid login" });
    }
  }
});

router.route("/forgetpassword").post(async (request, response) => {
  const { email_id } = request.body;
  const client = await createConnection();
  const user = await getUser(client, { email_id });
  if (!user) {
    response.send({ message: "user not exist" });
  } else {
    const token = jwt.sign({ id: user._id }, process.env.REKEY);
    const expiryDate = Date.now() + 3600000;
    const store = await inserttoken(client, {
      tokenid: user._id,
      token: token,
      expiryDate: expiryDate,
    });
    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;

    const mail = await sendEmail(user.email_id, "Password reset", link);
    response.send({
      message: "link has been send to your email for password change",
    });
  }
});

router.route("/resetpassword/:id/:token").post(async (request, response) => {
  const { password } = request.body;
  const id = request.params.id;
  const token = request.params.token;
  const client = await createConnection();
  const tokens = await gettoken(client, { token: token });
  if (!tokens) {
    response.send({ message: "invalid token" });
  } else {
    if (Date.now() < tokens.expiryDate) {
      const hashedPassword = await genPassword(password);
      const updateuserpassword = await updateUser(client, id, hashedPassword);
      const deletetokens = await deletetoken(client, id);
      response.send({ message: "password updated " });
    } else {
      response.send({ message: "link got expired" });
    }
  }
});

async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

router.route("/listofrecipes").get(async (request, response) => {
  const client = await createConnection();
  const mylist = await getAllRecipeData(client, {});
  response.send(mylist);
});

router.route("/addrecipe").post(async (request, response) => {
  const { title, src, list, prep } = request.body;
  const client = await createConnection();
  const myRecipe = await insertRecipeData(client, { title, src, list, prep });
  response.send({ message: "Successfully  recipe got added" });
});

router
  .route("/recipe/:_id")
  .delete(async (request, response) => {
    const _id = request.params._id;
    console.log(_id);
    const client = await createConnection();
    const deleteRecipe = await deleteRecipeData(client, _id);
    response.send({ message: "Successfully  recipe got deleted" });
  })
  .get(async (request, response) => {
    const _id = request.params._id;
    const client = await createConnection();
    const getOneRecipe = await getOneRecipeData(client, _id);
    response.send(getOneRecipe);
  })
  .patch(async (request, response) => {
    const _id = request.params._id;
    const { title, src, list, prep } = request.body;
    const client = await createConnection();
    const updateRecipe = await updateRecipedata(client, _id, {
      title,
      src,
      list,
      prep,
    });
    response.send({ message: "Successfully  recipe got edited" });
  });

export const userRouter = router;
