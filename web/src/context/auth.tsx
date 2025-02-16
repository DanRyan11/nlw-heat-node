import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '../services/api';

type User = {
    id: string;
    name : string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user : User | null;
    signInUrl: string;
    signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
    children : ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    },
}

export function AuthProvider(props: AuthProvider) {

    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?client_id=69c7314f9b513ff81c45&scope=user`;

    function getCurrentProfile() {
        const token = localStorage.getItem('token');

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data);
            });
        }
    }

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {code: githubCode});

        const { token, user } = response.data;

        localStorage.setItem('token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
    }

    function signOut() {
        setUser(null);
        localStorage.removeItem('token');
    }

    function verifyIfUserIsSign() {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if(hasGithubCode) {
            const [urlWithoutCode,githubCode] = url.split('?code=');            

            window.history.pushState({}, '', urlWithoutCode);

            signIn(githubCode);
        }
    }

    useEffect(() => {
        getCurrentProfile();
        verifyIfUserIsSign();
    },[])

    return (
        <AuthContext.Provider value={{signInUrl,user,signOut}}>
            {props.children}
        </AuthContext.Provider>
    )
}