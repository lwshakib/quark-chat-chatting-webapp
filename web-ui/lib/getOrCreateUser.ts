import { backendUrl } from "@/config";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";

export const getOrCreateUser = async () => {
    try{

        const user = await currentUser();
        if (!user) return null;
        
        const response = await axios.post(backendUrl+"/user/getOrCreateUser", {
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: user.fullName,
            imageUrl: user.imageUrl,
        });
        
        return response.data;
    }catch(error){
        console.log(error);
        return null;
    }
};
