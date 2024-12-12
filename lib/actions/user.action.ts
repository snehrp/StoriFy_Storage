"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constant";
import { redirect } from "next/navigation";

// use server will call every function of this file on the server side

// Create Account Flow

// 1. Users enter fullName and email
// 2. check if the user already exist using the email(we will use this to identify if we have to create new user document or not)
// 3. Send OTP to User's email
// 4. This is will send secret key for creating a session.
// 5. Create a new user document if it is a new User
// 6. Returns the user account Id
// 7. Verify OTP and authenticate to login

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
    )

    // If the anyone email matched with the given email then result.total > 0 , then it will return the result.document[0]
    return result.total > 0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message);

    throw error;
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();
    try {
        // createEmailToken sends the OTP to the given email and if the provided userId is not registered then it creates the new User with the provided Id and returns the secret key and userId
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
}

export const createAccount = async ({ fullName, email }: { fullName: string; email: string; }) => {

    // getUserByEmail function checks if there is a user with the provided email , if it is present then it will return the document

    // then sendEmailOTP sends the OTP to the provided email and if accountId is not created then it will throw and error

    // If there is no existing user with the provided email then it creates a new document in the database with the unique documentId and the provided data in the given database and the given user collection

    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });

    if (!accountId) throw new Error("Failed to send Email OTP");

    if (!existingUser) {
        const { databases } = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId
            },
        );
    }

    return parseStringify({ accountId });
}

export const verifySecret = async ({ accountId, password }: { accountId: string; password: string }) => {

    // createSession verifies accountId and password(OTP) and creates a session that has $id and secret

    // .set() sets the sessions's secret in the cookie with name 'appwrite-session' and session.secret and path = "/" means that cookie is available to the entire site
    // httpOnly = true means that client side javascript cannot access this cookie

    try {
        const { account } = await createAdminClient();

        const session = await account.createSession(accountId, password);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })

        return parseStringify({ sessionId: session.$id });
    } catch (error) {
        handleError(error, "Failed to verify OTP");
    }
}


export const getCurrentUser = async () => {
    try {
        const { account, databases } = await createSessionClient();

        const result = await account.get();

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)]
        );

        if (user.total <= 0) return null;

        return parseStringify(user.documents[0]);
    } catch (error) {
        console.log(error);
    }
}

export const signOutUser = async () => {

    const { account } = await createSessionClient()
    try {
        account.deleteSession('current');

        (await cookies()).delete("appwrite-session")

    } catch (error) {
        handleError(error, "Failed to Sign out user");
    } finally {
        redirect('/sign-in')
    }
}


export const signInUser = async ({ email }: { email: string }) => {
    try {
        const existingUser = await getUserByEmail(email);

        // User exist then send OTP
        if (existingUser) {
            await sendEmailOTP({ email });

            return parseStringify({ accountId: existingUser.accountId });
        }

        return parseStringify({ accountId: null, error: "User not found" })
    } catch (error) {
        handleError(error, "Failed to Sign in the User");
    }
}