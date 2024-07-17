'use client';

import { ISlot } from '@/interfaces/ap';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PiFunnelFill, PiInfoFill } from 'react-icons/pi';
import moment from 'moment';
import { useAuth } from '@/contexts/AuthContext';
import Edit from '@/components/Edit';
import Slot from '@/components/Slot';

export default function Upcoming() {
    const { user } = useAuth();

    const [page, setPage] = useState<'active' | 'upcoming' | 'all'>('active');
    const [isFilter, setIsFilter] = useState<boolean>(false);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const [slots, setSlots] = useState<ISlot[] | null>(null);
    const [selectedEditSlot, setSelectedEditSlot] = useState<number | null>(
        null
    );

    const config = {
        headers: {
            'ngrok-skip-browser-warning': '1',
        },
    };
    const fetchSlots = async () => {
        await axios
            .get(process.env.NEXT_PUBLIC_API_URL + '/ap', config)
            .then((res) => {
                setSlots(res.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchSlots();
        setPage((localStorage.getItem('page') as 'active' | 'all') || 'active');
        setShowDetails(
            (localStorage.getItem('showDetails') as 'true' | 'false') === 'true'
        );
        setIsFilter(
            (localStorage.getItem('isFilter') as 'true' | 'false') === 'true'
        );
    }, []);

    useEffect(() => {
        localStorage.setItem('showDetails', showDetails.toString());
    }, [showDetails]);

    useEffect(() => {
        localStorage.setItem('isFilter', isFilter.toString());
    }, [isFilter]);

    // const announcedSlots = slots?.filter((slot) => slot.announced);
    const activeSlots = slots?.filter((slot) => {
        const currentTime = moment();
        const startTime = moment(
            moment(slot.start).format('HH:mm:ss'),
            'HH:mm:ss'
        );
        const endTime = moment(moment(slot.end).format('HH:mm:ss'), 'HH:mm:ss');
        if (endTime.isBefore(startTime)) endTime.add(1, 'day');
        const isBetween = currentTime.isBetween(startTime, endTime);
        const isSameAsStart =
            currentTime.format('HH:mm') === startTime.format('HH:mm');

        if (isBetween || isSameAsStart) return slot;
    });
    const upcomingSlots = slots?.filter((slot) => {
        const currentTime = moment();
        const startTime = moment(
            moment(slot.start).format('HH:mm:ss'),
            'HH:mm:ss'
        );

        return startTime.isAfter(currentTime);
    });

    return (
        <>
            <div className="space-y-4 pb-28 min-h-screen">
                {page === 'active'
                    ? activeSlots
                          ?.filter((slot) => {
                              if (isFilter) {
                                  return user?.selectedDepartments.includes(
                                      slot.department
                                  );
                              }
                              return true;
                          })
                          .map((slot, index) => (
                              <Slot
                                  key={index}
                                  slot={slot}
                                  page={page}
                                  setSelectedEditSlot={setSelectedEditSlot}
                                  showDetails={showDetails}
                              />
                          ))
                    : page === 'upcoming'
                    ? upcomingSlots
                          ?.filter((slot) => {
                              if (isFilter) {
                                  return user?.selectedDepartments.includes(
                                      slot.department
                                  );
                              }
                              return true;
                          })
                          .map((slot, index) => (
                              <Slot
                                  key={index}
                                  slot={slot}
                                  page={page}
                                  setSelectedEditSlot={setSelectedEditSlot}
                                  showDetails={showDetails}
                              />
                          ))
                    : slots
                          ?.filter((slot) => {
                              if (isFilter) {
                                  return user?.selectedDepartments.includes(
                                      slot.department
                                  );
                              }
                              return true;
                          })
                          .map((slot, index) => (
                              <Slot
                                  key={index}
                                  slot={slot}
                                  page={page}
                                  setSelectedEditSlot={setSelectedEditSlot}
                                  showDetails={showDetails}
                              />
                          ))}
            </div>

            {selectedEditSlot && (
                <div className="z-40 fixed bottom-0 left-0 right-0 rounded-t-3xl bg-neutral-50 shadow-3xl flex justify-center items-center px-2 py-6">
                    <Edit
                        slot={selectedEditSlot}
                        onFinished={() => {
                            fetchSlots();
                            setSelectedEditSlot(null);
                        }}
                        user={user}
                    />
                </div>
            )}

            {selectedEditSlot && (
                <div
                    onClick={() => setSelectedEditSlot(null)}
                    className="z-30 fixed top-0 bottom-0 left-0 right-0 bg-black/10 backdrop-blur-sm"
                ></div>
            )}

            <div className="z-20 fixed bottom-6 left-4 right-4 h-16 bg-white shadow-md rounded-2xl flex justify-between items-center font-bold text-gray-300 p-2.5 pr-4 space-x-2">
                <div className="flex w-full h-full">
                    <button
                        onClick={() => {
                            setPage('active');
                            localStorage.setItem('page', 'active');
                        }}
                        className={`w-full h-full rounded-lg ${
                            page === 'active'
                                ? 'bg-primary-500 text-white'
                                : 'text-gray-400'
                        }`}
                    >
                        ปัจจุบัน
                    </button>
                    <button
                        onClick={() => {
                            setPage('upcoming');
                            localStorage.setItem('page', 'upcoming');
                        }}
                        className={`w-full h-full rounded-lg ${
                            page === 'upcoming'
                                ? 'bg-primary-500 text-white'
                                : 'text-gray-400'
                        }`}
                    >
                        อนาคต
                    </button>
                    <button
                        onClick={() => {
                            setPage('all');
                            localStorage.setItem('page', 'all');
                        }}
                        className={`w-full h-full rounded-lg ${
                            page === 'all'
                                ? 'bg-primary-500 text-white'
                                : 'text-gray-400'
                        }`}
                    >
                        ทั้งหมด
                    </button>
                </div>
                <div className="flex h-full space-x-1">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className={`h-full aspect-square grid place-content-center text-2xl rounded-lg ${
                            showDetails && 'bg-primary-500 text-white'
                        }`}
                    >
                        <PiInfoFill />
                    </button>
                    <button
                        onClick={() => setIsFilter(!isFilter)}
                        className={`h-full aspect-square grid place-content-center text-2xl rounded-lg ${
                            isFilter && 'bg-primary-500 text-white'
                        }`}
                    >
                        <PiFunnelFill />
                    </button>
                </div>
            </div>
            <div className="z-10 fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none"></div>
        </>
    );
}
