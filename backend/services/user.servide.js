import User from "../model/user.model.js";
export const createUser=async({userName,email,password})=>{
    try {
        if(!userName||!email||!password){
           throw new Error("all the fields are required ")
        }
       
        const user=await User.create({
            userName,
            email,
            password

        })
        if(!user){
            throw new Error("error creating user at regoister")
        }
        return user
    }
     catch (error) {
        console.log(error)
        throw new Error(500).json(error)
    }}