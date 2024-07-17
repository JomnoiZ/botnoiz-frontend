import { ISlot } from '@/interfaces/ap';
import { IUser } from '@/interfaces/user';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { BarLoader } from 'react-spinners';

interface EditProps {
    slot?: number;
    onFinished?: () => void;
    user: IUser | null;
}

const Edit: React.FC<EditProps> = ({ slot: inputSlot, onFinished, user }) => {
    const [offset, setOffset] = useState<number>(0);
    const [slot, setSlot] = useState<number>(0);
    const [activeSlot, setActiveSlot] = useState<ISlot | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchActiveSlot = async () => {
            await axios
                .get(process.env.NEXT_PUBLIC_API_URL + '/ap/active')
                .then((res) => {
                    setActiveSlot(res.data.data[0]);
                    setSlot(res.data.data[0].slot);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchActiveSlot();
    }, []);

    const announceHandler = async () => {
        setIsLoading(true);
        if (!user || !user.userId || !user.displayName) {
            console.error('');
            setOffset(0);
            setIsLoading(false);
            onFinished && onFinished();
        } else
            await axios
                .patch(process.env.NEXT_PUBLIC_API_URL + '/ap/offset', {
                    slot: inputSlot || slot,
                    offset,
                    userId: user.userId,
                    displayName: user.displayName,
                })
                .then(() => {
                    setOffset(0);
                    setIsLoading(false);
                    onFinished && onFinished();
                })
                .catch((error) => {
                    console.error(error);
                    setOffset(0);
                    setIsLoading(false);
                    onFinished && onFinished();
                });
    };

    const createArrayFromRange = (start: number, end: number) => {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    if (isLoading)
        return (
            <div className="flex flex-col justify-center items-center w-full rounded-xl px-6 py-4 select-none h-36 space-y-4">
                <BarLoader color="#8B5CF6" />
                <p className="font-bold text-neutral-400 text-xs">
                    รอแปปนะฮะ...
                </p>
            </div>
        );

    return (
        <div className="w-full rounded-xl px-6 py-4 select-none h-36">
            <div className="flex justify-between">
                <div className="space-y-3">
                    <div className="space-x-1">
                        <span className="font-bold text-primary-500 text-6xl">
                            {offset === 0
                                ? 0
                                : offset > 0
                                ? `+${offset}`
                                : offset}
                        </span>
                        <span className="font-bold text-neutral-400">นาที</span>
                    </div>
                    {!inputSlot && (
                        <div className="space-x-2">
                            <span className="font-bold text-neutral-400">
                                ตั้งแต่ Slot ที่
                            </span>
                            <select
                                value={slot || activeSlot?.slot}
                                onChange={(e) => setSlot(+e.target.value)}
                                className="bg-transparent border-2 border-neutral-300 rounded-lg px-4 py-1 text-neutral-700 font-bold"
                            >
                                <option value={activeSlot?.slot}>
                                    {activeSlot?.slot}
                                </option>
                                {activeSlot?.slot &&
                                    createArrayFromRange(
                                        activeSlot.slot,
                                        200
                                    ).map((slot) => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="flex flex-col space-y-6 items-center">
                    <div className="flex items-center space-x-2">
                        <div
                            onClick={() => setOffset((prev) => prev + 10)}
                            className="text-xs text-secondary-600 rounded-full shadow-md p-3 bg-white"
                        >
                            <FiPlus />
                        </div>
                        <div
                            onClick={() => setOffset((prev) => prev + 1)}
                            // onPointerDown={() => {
                            //     const timeout = setTimeout(() => {
                            //         const interval = setInterval(() => {
                            //             setOffset((prev) => prev + 1);
                            //         }, 100);
                            //         document.addEventListener(
                            //             'pointerup',
                            //             () => clearInterval(interval),
                            //             { once: true }
                            //         );
                            //     }, 300);
                            //     document.addEventListener(
                            //         'pointerup',
                            //         () => clearTimeout(timeout),
                            //         { once: true }
                            //     );
                            // }}
                            className="text-xs text-neutral-400 rounded-full shadow-md p-3 bg-white"
                        >
                            <FiPlus />
                        </div>
                        <div
                            onClick={() => setOffset((prev) => prev - 1)}
                            // onPointerDown={() => {
                            //     const timeout = setTimeout(() => {
                            //         const interval = setInterval(() => {
                            //             setOffset((prev) => prev - 1);
                            //         }, 100);
                            //         document.addEventListener(
                            //             'pointerup',
                            //             () => clearInterval(interval),
                            //             { once: true }
                            //         );
                            //     }, 300);
                            //     document.addEventListener(
                            //         'pointerup',
                            //         () => clearTimeout(timeout),
                            //         { once: true }
                            //     );
                            // }}
                            className="text-xs text-neutral-400 rounded-full shadow-md p-3 bg-white"
                        >
                            <FiMinus />
                        </div>
                        <div
                            onClick={() => setOffset((prev) => prev - 10)}
                            className="text-xs text-secondary-600 rounded-full shadow-md p-3 bg-white"
                        >
                            <FiMinus />
                        </div>
                    </div>
                    {offset !== 0 && (
                        <button
                            onClick={announceHandler}
                            className="font-bold text-white bg-primary-500 px-6 py-2 rounded-xl shadow-md text-sm"
                        >
                            ประกาศ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Edit;
