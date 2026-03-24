"use client";
import { useState } from 'react';

interface TimePickerProps {
  initialTime: string;
  onTimeChange: (time: string) => void;
}

export default function TimePickerDropdown({ initialTime, onTimeChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(initialTime.split(':')[0]);
  const [minute, setMinute] = useState(initialTime.split(':')[1].split(' ')[0]);
  const [ampm, setAmpm] = useState(initialTime.split(' ')[1]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleTimeSelect = (type: 'hour' | 'minute' | 'ampm', value: string) => {
    let newHour = hour;
    let newMinute = minute;
    let newAmpm = ampm;

    if (type === 'hour') {
      setHour(value);
      newHour = value;
    } else if (type === 'minute') {
      setMinute(value);
      newMinute = value;
    } else if (type === 'ampm') {
      setAmpm(value);
      newAmpm = value;
    }

    onTimeChange(`${newHour}:${newMinute} ${newAmpm}`);
  };

  return (
    <div className="relative z-[9999]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-2 border-[#5C5CFF] px-4 py-2 rounded-lg cursor-pointer flex items-center gap-3 text-black font-bold shadow-sm hover:border-blue-700 transition min-w-[130px]"
      >
        <span>{hour}:{minute} {ampm}</span>
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 shadow-2xl rounded-xl flex h-48 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="overflow-y-auto w-12 border-r border-gray-100 scrollbar-hide py-1 bg-white">
            {hours.map(h => (
              <div
                key={h}
                onClick={() => handleTimeSelect('hour', h)}
                className={`p-2 text-center cursor-pointer hover:bg-blue-50 text-sm ${hour === h ? 'bg-[#5C5CFF] text-white font-bold' : ''}`}
              >
                {h}
              </div>
            ))}
          </div>

          <div className="overflow-y-auto w-12 border-r border-gray-100 scrollbar-hide py-1 bg-white">
            {minutes.map(m => (
              <div
                key={m}
                onClick={() => handleTimeSelect('minute', m)}
                className={`p-2 text-center cursor-pointer hover:bg-blue-50 text-sm ${minute === m ? 'bg-[#5C5CFF] text-white font-bold' : ''}`}
              >
                {m}
              </div>
            ))}
          </div>

          <div className="w-16 flex flex-col py-1 bg-white">
            {['AM', 'PM'].map(p => (
              <div
                key={p}
                onClick={() => handleTimeSelect('ampm', p)}
                className={`p-2 text-center cursor-pointer hover:bg-blue-50 flex-1 flex items-center justify-center text-sm font-bold ${ampm === p ? 'bg-[#5C5CFF] text-white' : ''}`}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}