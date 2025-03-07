import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();

    // get currently logged in user (get from session)
    const session = await getServerSession(authOptions);

    // we can extract the user from the session, 
    // beacause we injected it in the session.
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 401});
    } 

    const userId = user._id;
    
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            {isAcceptingMessage: acceptMessages},
            {new: true}
        )

        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept message"
            }, {status: 401});
        }

        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        }, {status: 200});

    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to update user status to accept message"
        }, {status: 500});
    }

}

export async function GET(request: Request) {
    await dbConnect();

    // get currently logged in user (get from session)
    const session = await getServerSession(authOptions);

    // we can extract the user from the session, 
    // beacause we injected it in the session.
    const user: User = session?.user as User;

    if(!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 401});
    } 

    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);

        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404});
        }   
    
        return Response.json({
            success: true,
            message: "User found succeffully",
            isAcceptingMessages: foundUser.isAcceptingMessage
        }, {status: 200});

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, {status: 500});
    }

}