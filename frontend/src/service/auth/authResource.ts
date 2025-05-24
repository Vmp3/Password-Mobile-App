import api from "../../utils/api";

export const signin = (data) => {
    return api.post('auth/sigin', data).then((response) => response.data)
}

export const signup = (data) =>{
    return api.post('auth/signup', data).then((response) => response.data)

}

export const signout = () =>{
    return api.get('auth/signout').then((response) => response.data)

}