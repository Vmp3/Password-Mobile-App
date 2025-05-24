import * as authResource from "./authResource"

export const signIn = async (email: string, password: string) => {
    const response = await authResource.signin({ email, senha: password })
    return response
}

export const signUp = async (nome: string, email: string, dataNascimento: string, senha: string, confirmPassword: string) => {
    if (senha !== confirmPassword) {
        throw new Error("As senhas não coincidem")
    }
    
    const [day, month, year] = dataNascimento.split('/')
    const dateOnly = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    
    const response = await authResource.signup({ 
        nome, 
        email, 
        dataNascimento: dateOnly, 
        senha,
        confirmacaoSenha: confirmPassword
    })
    return response
}

export const signOut = async () => {
    const response = await authResource.signout()
    return response
}