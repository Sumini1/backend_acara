import mongoose from "mongoose"
import { BooleanLiteral } from "typescript";
import { encrypt } from "../utils/encryption";
// import { User } from './user.model';


export interface User {
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive : boolean;
    activationCode: string;
}


const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
    fullName : {
        type: Schema.Types.String,
        required: true
    },
    username : {
        type: Schema.Types.String,
        required: true
    },
    email : {
        type: Schema.Types.String,
        required: true
    },
    password : {
        type:  Schema.Types.String,
        required: true
    },
    role : {
        type: Schema.Types.String,
        enum : ["user", "admin"],
        default: "user",
   
    },
    profilePicture : {
        type: Schema.Types.String,
        default: "user.jpg",
   
    },
    isActive : {
        type: Schema.Types.Boolean,
        default: false
    },
    activationCode : {
        type: Schema.Types.String,
   
    }
},
{
    timestamps: true
})

// encryption ke database agar password hex 
UserSchema.pre('save', function(next) {
    const user = this;
    user.password = encrypt(user.password);
    next();

});

// menghapus password agar tidak muncul ketika login
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
  };

const  UserModel = mongoose.model('User', UserSchema);
export default UserModel