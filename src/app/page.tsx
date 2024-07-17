'use client';
import APSelection from '@/components/APSelection';
import Edit from '@/components/Edit';
import Logout from '@/components/Logout';
import PowerButton from '@/components/PowerButton';
import { useAuth } from '@/contexts/AuthContext';
import { useLiff } from '@/contexts/LiffContext';

export default function Home() {
    const liff = useLiff();
    const { user } = useAuth();

    return (
        <div className="space-y-4">
            <PowerButton />
            {user?.superuser && <Edit user={user} />}
            <APSelection />
            {/* <Logout /> */}
        </div>
    );
}
