import mongoose from "mongoose";

const UserSchema =
new mongoose.Schema({

username: {
type: String,
unique: true,
},

userId: String,

password: String,

avatar: String,

online: {
type: Boolean,
default: false,
},

friends: [
{
username: String,
userId: String,
avatar: String,
},
],

});

export default
mongoose.models.User ||
mongoose.model(
"User",
UserSchema
);
