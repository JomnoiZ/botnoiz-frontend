import LG23APBotImage from '@/public/lg23-ap-bot.jpg';
import Image from 'next/image';
import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';

export default function Login({
    loginHandler,
}: {
    loginHandler: (studentId: string) => void;
}): JSX.Element {
    const [studentId, setStudentId] = useState<string>('');

    const isStudentIdValid = /^6[5|6|7]3\d{5}21$/.test(studentId);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [showWarning, setShowWarning] = useState<boolean>(false);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center space-y-8 pb-6 bg-white">
            <div className="relative h-28 rounded-full bg-white overflow-hidden border-8 border-white shadow-lg aspect-square">
                <Image src={LG23APBotImage} alt="" fill />
            </div>
            <div className="space-y-1">
                <h1 className="font-bold text-3xl text-neutral-800">
                    ใครน่ะ?!
                </h1>
                <p className="text-sm text-neutral-500">
                    กรอกรหัสนิสิตเพื่อยืนยันตัวหน่อย
                </p>
                {showWarning && (
                    <p className="text-sm text-error-500">
                        ต้องเป็นเด็กข้างไข่ JomnoiZ ก่อนนะงับ
                    </p>
                )}
            </div>
            <input
                type="text"
                className="outline-none bg-transparent border-2 border-neutral-300 rounded-lg px-3 py-1.5"
                placeholder="หก..."
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
            />
            <button
                onClick={() => {
                    if (isLoading) return;
                    loginHandler(studentId);
                    setIsLoading(true);
                    setShowWarning(true);
                }}
                className={`bg-neutral-800 text-white rounded-lg p-4 text-lg shadow-md duration-300 ${
                    isStudentIdValid
                        ? 'opacity-100 pointer-events-auto'
                        : 'pointer-events-none opacity-0'
                }`}
            >
                <FiArrowRight />
            </button>
        </div>
    );
}
