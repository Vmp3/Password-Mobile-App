import * as authResource from "./authResource"

export const signIn = async (data) => {
    const response = await authResource.signin({data})
    return response
}

export const signUp = async (password, confirmPassword, ...data) => {
    if (password !== confirmPassword ) {
        throw new Error("Passwords do not match")
    }
    
    const response = await authResource.signup({password, confirmPassword, ...data})
    return response
}

export const signout = async () => {
    const response = await authResource.signout()
    return response
}