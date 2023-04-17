/** I haven't been able to get this working. I'm trying to set up a facade for Clerk
 * in case I ever want to build my own identity provider or move to a new one, but I'm not sure
 * how to export the hooks so that they can be used in the same way as Clerk's hooks.
 */


import { SignInButton, useClerk, useUser, } from "@clerk/nextjs";

// user, isSignedIn
const useUsersManagement = {

    useUser: { useUser, ...useClerk },
    SignInButton,
}

export default useUsersManagement



