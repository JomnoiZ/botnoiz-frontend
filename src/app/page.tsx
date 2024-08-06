'use client';
import APSelection from '@/components/APSelection';
import Edit from '@/components/Edit';
import Logout from '@/components/Logout';
import PowerButton from '@/components/PowerButton';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="space-y-4">
            <PowerButton />
            {user?.superuser && <Edit user={user} />}
            <APSelection />
            <Logout />
        </div>
    );
}
