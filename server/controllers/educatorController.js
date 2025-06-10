import {clerkClient} from '@clerk/express'

//update role of user to educator

export const updateRoleToEducator = async()=>{
    try{
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',
            }
        })
        res.json({success:true,message:'You can publish your course now '})
    }
    catch(error){
        res.json({ success:false, message: error.message})
    }
}