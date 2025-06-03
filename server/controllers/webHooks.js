import { Webhook } from "svix";
import User from "../models/User.model";

//API controller Function to manage Clerk User with database


const clerkWebhooks = async(req,res)=>{
    try {
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body) ,{
            "swix-id":req.header["swix-id"],
            "swix-timestamp":req.header["swix-timestamp"],
            "swix-signature":req.header["swix-signature"]
        })

        const {data,type}= req.body
        switch (type) {
            case 'user.created':{
                const userData={
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name:data.first_name+ " "+ data.last_name,
                    imageUrl:data.image_url,
                }
                await User.create(userData)
                res.json({})
                break;
            }
                
            case 'user.updated':{
                const userData={
                    email: data.email_address[0].email_address,
                    name:data.first_name+ " "+ data.last_name,
                    imageUrl:data.image_url,
                }
                await User.findByIdAndUpdate(data._d,userData)
                res.json({})
                break;
            }
                
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

        
            default:
                break;
        }
    } catch (error) {
        res.json({succes:false,message:error?.message || "User Error occured"})
    }
}