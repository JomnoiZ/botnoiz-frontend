import LiffProvider from '@/contexts/LiffContext';
import './globals.css';
import { IBM_Plex_Sans_Thai } from 'next/font/google';
import AuthProvider from '@/contexts/AuthContext';

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
    subsets: ['thai'],
    weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const metadata = {
    title: 'เลขาฝ่ายแผน',
    description: 'ลานเกียร์ต้องรอด',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="th">
            <body
                className={`${ibmPlexSansThai.className} flex justify-center bg-gray-50`}
            >
                <LiffProvider>
                    <AuthProvider>
                        <div className="max-w-screen-sm w-full p-4">
                            {children}
                        </div>
                    </AuthProvider>
                </LiffProvider>
            </body>
        </html>
    );
}
