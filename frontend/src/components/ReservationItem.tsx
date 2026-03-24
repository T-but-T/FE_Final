"use client";
import TimePickerDropdown from "./TimePickerDropdown";

interface ReservationItemProps {
  res: any;
  userName: string;
  onEditToggle: (id: string) => void;
  onCancel: (id: string) => void;
  onSave: (id: string, time: string) => void;
  onDelete: (id: string) => void;
  onTimeUpdate: (id: string, time: string) => void;
}

export default function ReservationItem({
  res,
  userName,
  onEditToggle,
  onCancel,
  onSave,
  onDelete,
  onTimeUpdate,
}: ReservationItemProps) {
  return (
    <div className="relative flex flex-col sm:flex-row justify-between items-center bg-[#F9F9F9] p-5 border border-gray-200 rounded-lg mb-4 shadow-sm gap-4">
      <div className="flex flex-col text-center sm:text-left">
        <span className="font-bold text-xl text-blue-700">
          {res.restaurant}
        </span>
        <span className="text-sm text-gray-500 italic">
          Reserved for: {userName}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 relative">
        {res.isEditing ? (
          <>
            <TimePickerDropdown
              initialTime={res.time}
              onTimeChange={(newTime) => onTimeUpdate(res.id, newTime)}
            />
            <button
              onClick={() => onSave(res.id, res.time)}
              className="px-6 py-2 bg-black text-white font-bold rounded-lg border-2 border-black hover:bg-gray-800 transition"
            >
              Save
            </button>
            <button
              onClick={() => onCancel(res.id)}
              className="px-6 py-2 bg-white text-gray-600 font-bold rounded-lg border-2 border-gray-400 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="bg-white border border-gray-300 px-5 py-2.5 rounded-lg font-bold shadow-sm text-blue-600 min-w-[120px] text-center">
              {res.time}
            </div>
            <button
              onClick={() => onEditToggle(res.id)}
              className="px-8 py-2.5 bg-white text-black border-2 border-black font-bold hover:bg-gray-100 transition rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(res.id)}
              className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition rounded-lg"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
