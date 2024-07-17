'use client';
import axios from 'axios';
import Loading from '@/app/loading';
import Login from '@/components/Login';
import { IUser } from '@/interfaces/user';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLiff } from './LiffContext';

interface AuthContextProps {
    user: IUser | null;
    logoutHandler: () => void;
    fetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
    user: null,
    logoutHandler: () => {},
    fetchUser: async () => {},
});

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const liff = useLiff();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<IUser | null>(null);
    const config = {
        headers: {
            'ngrok-skip-browser-warning': '1',
        },
    };
    const loginHandler = async (studentId: string) => {
        if (liff?.isInClient()) {
            const lineUserData = await liff?.getProfile();

            const userData = await axios
                .post(process.env.NEXT_PUBLIC_API_URL + '/user/', {
                    studentId,
                    displayName: lineUserData?.displayName,
                    userId: lineUserData?.userId,
                })
                .then((res) => res.data.data)
                .catch(() => console.log('create user failed'));

            localStorage.setItem('studentId', studentId);
            setUser(userData);
            return;
        }
        console.log(process.env.NEXT_PUBLIC_API_URL + '/user/' + studentId);

        const userData = await axios
            .get(process.env.NEXT_PUBLIC_API_URL + '/user/' + studentId, config)
            .then((res) => {
                console.log(res);
                return res.data.data;
            })
            .catch(() => console.log('get user failed'));
        console.log(userData);

        if (userData) {
            localStorage.setItem('studentId', studentId);
            setUser(userData);
            return;
        }

        console.log('not in client');
    };

    const logoutHandler = () => {
        // reset user selected ap in db

        // remove local storage
        localStorage.removeItem('studentId');
        setUser(null);
    };

    const fetchUser = async () => {
        setIsLoading(true);
        const studentId = localStorage.getItem('studentId');

        const userData = await axios
            .get(process.env.NEXT_PUBLIC_API_URL + '/user/' + studentId)
            .then((res) => res.data.data)
            .catch(() => null);

        if (studentId) {
            setUser(userData);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (!user) {
        return <Login loginHandler={loginHandler} />;
    }

    return (
        <AuthContext.Provider value={{ user, logoutHandler, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a UserProvider');
    }
    return context;
};
