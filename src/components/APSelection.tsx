import { useAuth } from '@/contexts/AuthContext';
import { departments } from '@/interfaces/orgChart';
import axios from 'axios';
import { useState } from 'react';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';

export default function APSelection(): JSX.Element {
    const { user, fetchUser } = useAuth();

    const selectedData = user?.selectedDepartments ?? [];
    const [selectedAP, setSelectedAP] = useState<string[]>(selectedData);

    const saveHandler = async () => {
        await axios
            .patch(
                process.env.NEXT_PUBLIC_API_URL + '/user/' + user?.studentId,
                {
                    selectedDepartments: selectedAP,
                }
            )
            .then(() => fetchUser())
            .catch(() => fetchUser());
    };

    return (
        <div className="w-full rounded-xl shadow-md bg-white px-6 py-4 space-y-2">
            <div className="py-2 flex  justify-evenly">
                <button
                    onClick={() => {
                        setSelectedAP(
                            Object.keys(departments)
                                .map(
                                    (department) =>
                                        departments[
                                            department as keyof typeof departments
                                        ]
                                )
                                .flat()
                                .map((ap) => ap.shortName)
                        );
                    }}
                    className="bg-primary-500 rounded-2xl px-6 py-2 text-white font-medium"
                >
                    เลือกทุกฝ่าย
                </button>
                <button
                    onClick={() => {
                        setSelectedAP([]);
                    }}
                    className="border-primary-500 border-2 rounded-2xl px-6 py-2 text-primary-500 font-medium"
                >
                    ไม่เลือกทุกฝ่าย
                </button>
            </div>
            {selectedAP.length === 0 && (
                <div className="py-2 text-error-300">
                    อย่าลืมเลือกฝ่ายที่ต้องการแจ้ง AP นะ!
                </div>
            )}
            {Object.keys(departments).map((department) => (
                <div key={department} className="py-2">
                    <p className="font-medium text-neutral-500">{department}</p>
                    {departments[department as keyof typeof departments].map(
                        (ap) => (
                            <button
                                key={ap.shortName}
                                className="flex items-center space-x-3 py-2 mt-2 w-full"
                                onClick={() => {
                                    if (selectedAP.includes(ap.shortName)) {
                                        setSelectedAP(
                                            selectedAP.filter(
                                                (selected) =>
                                                    selected !== ap.shortName
                                            )
                                        );
                                    } else {
                                        setSelectedAP([
                                            ...selectedAP,
                                            ap.shortName,
                                        ]);
                                    }
                                }}
                            >
                                {selectedAP.includes(ap.shortName) ? (
                                    <FiCheckSquare className="text-2xl text-primary-500" />
                                ) : (
                                    <FiSquare className="text-2xl text-neutral-300" />
                                )}
                                <p
                                    className={`font-medium ${
                                        selectedAP.includes(ap.shortName)
                                            ? 'text-neutral-900'
                                            : 'text-neutral-500'
                                    }`}
                                >
                                    {ap.name}
                                </p>
                                <div className="text-xs font-medium text-neutral-400 bg-neutral-100 rounded-lg px-2 py-1">
                                    {ap.shortName}
                                </div>
                            </button>
                        )
                    )}
                </div>
            ))}
            {JSON.stringify(selectedAP) !== JSON.stringify(selectedData) && (
                <div className="flex flex-col items-center justify-center space-y-3 pt-6 pb-4">
                    <p className="text-xs text-neutral-500">อย่าลืมกดบันทึก</p>
                    <button
                        onClick={saveHandler}
                        className="bg-primary-500 rounded-lg px-6 py-2 text-white font-medium"
                    >
                        บันทึก
                    </button>
                </div>
            )}
        </div>
    );
}
