import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Building2,
  CalendarDays,
  Download,
  GraduationCap,
  Plus,
  Trash2,
  Users,
  X,
  Clock,
  BarChart3,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";

const COLORS = [
  "bg-blue-100 border-blue-300 text-blue-900",
  "bg-emerald-100 border-emerald-300 text-emerald-900",
  "bg-purple-100 border-purple-300 text-purple-900",
  "bg-amber-100 border-amber-300 text-amber-900",
  "bg-pink-100 border-pink-300 text-pink-900",
  "bg-cyan-100 border-cyan-300 text-cyan-900",
  "bg-lime-100 border-lime-300 text-lime-900",
  "bg-orange-100 border-orange-300 text-orange-900",
];

const DAYS_5 = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAYS_6 = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:15 - 12:15",
  "12:15 - 01:15",
  "02:00 - 03:00",
  "03:00 - 04:00",
];

const initialFaculty = [
  { id: 1, name: "Dr. Meera Rao", department: "CSE", maxHours: 12 },
  { id: 2, name: "Prof. Arjun Menon", department: "Math", maxHours: 10 },
  { id: 3, name: "Ms. Sana Khan", department: "IT", maxHours: 14 },
];

const initialRooms = [
  { id: 1, name: "Room A-101", capacity: 60, type: "Lecture Hall" },
  { id: 2, name: "Lab B-204", capacity: 45, type: "Computer Lab" },
  { id: 3, name: "Seminar C-12", capacity: 35, type: "Seminar Room" },
];

const initialCourses = [
  { id: 1, code: "CS101", name: "Data Structures", facultyId: 1, weeklyHours: 4, students: 55, color: COLORS[0] },
  { id: 2, code: "MA201", name: "Discrete Mathematics", facultyId: 2, weeklyHours: 3, students: 45, color: COLORS[1] },
  { id: 3, code: "FE301", name: "Frontend Engineering", facultyId: 3, weeklyHours: 4, students: 50, color: COLORS[2] },
];

function Button({ children, className = "", variant = "default", size = "default", ...props }) {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    icon: "h-10 w-10",
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

function Field({ label, children }) {
  return (
    <label className="space-y-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${className}`}
    />
  );
}

function SelectInput({ className = "", ...props }) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ${className}`}
    />
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900">{value}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState(initialCourses);
  const [rooms, setRooms] = useState(initialRooms);
  const [faculty, setFaculty] = useState(initialFaculty);
  const [sixDayWeek, setSixDayWeek] = useState(true);
  const [schedule, setSchedule] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [search, setSearch] = useState("");

  const days = sixDayWeek ? DAYS_6 : DAYS_5;
  const totalSlots = days.length * TIME_SLOTS.length;
  const scheduledSlots = Object.keys(schedule).length;
  const freeSlots = totalSlots - scheduledSlots;

  const facultyById = useMemo(() => Object.fromEntries(faculty.map((f) => [f.id, f])), [faculty]);
  const roomById = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r])), [rooms]);
  const courseById = useMemo(() => Object.fromEntries(courses.map((c) => [c.id, c])), [courses]);

  const filteredCourses = courses.filter((course) => `${course.code} ${course.name}`.toLowerCase().includes(search.toLowerCase()));
  const filteredRooms = rooms.filter((room) => `${room.name} ${room.type}`.toLowerCase().includes(search.toLowerCase()));
  const filteredFaculty = faculty.filter((person) => `${person.name} ${person.department}`.toLowerCase().includes(search.toLowerCase()));

  const addCourse = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const facultyId = Number(form.get("facultyId"));
    setCourses((prev) => [
      ...prev,
      {
        id: nextId(prev),
        code: form.get("code") || "NEW101",
        name: form.get("name") || "New Course",
        facultyId,
        weeklyHours: Number(form.get("weeklyHours")) || 1,
        students: Number(form.get("students")) || 30,
        color: COLORS[prev.length % COLORS.length],
      },
    ]);
    event.currentTarget.reset();
  };

  const addRoom = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setRooms((prev) => [
      ...prev,
      {
        id: nextId(prev),
        name: form.get("name") || "New Room",
        capacity: Number(form.get("capacity")) || 30,
        type: form.get("type") || "Lecture Hall",
      },
    ]);
    event.currentTarget.reset();
  };

  const addFaculty = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setFaculty((prev) => [
      ...prev,
      {
        id: nextId(prev),
        name: form.get("name") || "New Faculty",
        department: form.get("department") || "General",
        maxHours: Number(form.get("maxHours")) || 10,
      },
    ]);
    event.currentTarget.reset();
  };

  const deleteItem = (type, id) => {
    if (type === "course") setCourses((prev) => prev.filter((item) => item.id !== id));
    if (type === "room") setRooms((prev) => prev.filter((item) => item.id !== id));
    if (type === "faculty") setFaculty((prev) => prev.filter((item) => item.id !== id));

    setSchedule((prev) => {
      const next = { ...prev };
      Object.entries(next).forEach(([key, slot]) => {
        if (
          (type === "course" && slot.courseId === id) ||
          (type === "room" && slot.roomId === id) ||
          (type === "faculty" && slot.facultyId === id)
        ) {
          delete next[key];
        }
      });
      return next;
    });
  };

  const generateTimetable = () => {
    const newSchedule = {};
    const usedFaculty = new Set();
    const usedRooms = new Set();
    const facultyHours = Object.fromEntries(faculty.map((f) => [f.id, 0]));
    const sortedCourses = [...courses].sort((a, b) => b.weeklyHours - a.weeklyHours);

    for (const course of sortedCourses) {
      let assigned = 0;
      const facultyMember = facultyById[course.facultyId];
      const possibleRooms = rooms.filter((room) => room.capacity >= course.students);

      for (const day of days) {
        for (const time of TIME_SLOTS) {
          if (assigned >= course.weeklyHours) break;
          if (!facultyMember) continue;
          if (facultyHours[course.facultyId] >= facultyMember.maxHours) continue;

          const key = `${day}-${time}`;
          if (newSchedule[key]) continue;
          if (usedFaculty.has(`${course.facultyId}-${day}-${time}`)) continue;

          const room = possibleRooms.find((candidate) => !usedRooms.has(`${candidate.id}-${day}-${time}`));
          if (!room) continue;

          newSchedule[key] = {
            courseId: course.id,
            facultyId: course.facultyId,
            roomId: room.id,
            day,
            time,
          };

          usedFaculty.add(`${course.facultyId}-${day}-${time}`);
          usedRooms.add(`${room.id}-${day}-${time}`);
          facultyHours[course.facultyId] += 1;
          assigned += 1;
        }
      }
    }

    setSchedule(newSchedule);
  };

  const exportCSV = () => {
    const rows = [
      ["Day", "Time", "Course Code", "Course Name", "Faculty", "Room", "Capacity"],
    ];

    days.forEach((day) => {
      TIME_SLOTS.forEach((time) => {
        const slot = schedule[`${day}-${time}`];

        if (slot) {
          const course = courseById[slot.courseId];
          const person = facultyById[slot.facultyId];
          const room = roomById[slot.roomId];

          rows.push([
            day,
            time,
            course?.code,
            course?.name,
            person?.name,
            room?.name,
            room?.capacity,
          ]);
        } else {
          rows.push([day, time, "FREE", "FREE", "", "", ""]);
        }
      });
    });

    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "university-timetable.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const removeSlot = () => {
    if (!selectedSlot) return;
    setSchedule((prev) => {
      const next = { ...prev };
      delete next[`${selectedSlot.day}-${selectedSlot.time}`];
      return next;
    });
    setSelectedSlot(null);
  };

  const renderList = () => {
    if (activeTab === "courses") {
      return (
        <div className="space-y-4">
          <form onSubmit={addCourse} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Field label="Course Code"><TextInput name="code" placeholder="CS101" /></Field>
            <Field label="Course Name"><TextInput name="name" placeholder="Operating Systems" /></Field>
            <Field label="Faculty">
              <SelectInput name="facultyId" required>
                {faculty.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </SelectInput>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Weekly Hours"><TextInput name="weeklyHours" type="number" min="1" max="12" placeholder="4" /></Field>
              <Field label="Students"><TextInput name="students" type="number" min="1" placeholder="60" /></Field>
            </div>
            <Button><Plus className="mr-2 h-4 w-4" />Add Course</Button>
          </form>

          {filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-black text-slate-900">{course.code}</p>
                  <p className="text-sm text-slate-600">{course.name}</p>
                  <p className="mt-2 text-xs text-slate-500">{facultyById[course.facultyId]?.name} • {course.weeklyHours} hrs/week • {course.students} students</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteItem("course", course.id)}><Trash2 className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (activeTab === "rooms") {
      return (
        <div className="space-y-4">
          <form onSubmit={addRoom} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Field label="Room Name"><TextInput name="name" placeholder="Room A-101" /></Field>
            <Field label="Capacity"><TextInput name="capacity" type="number" min="1" placeholder="60" /></Field>
            <Field label="Room Type"><TextInput name="type" placeholder="Lecture Hall" /></Field>
            <Button><Plus className="mr-2 h-4 w-4" />Add Room</Button>
          </form>

          {filteredRooms.map((room) => (
            <Card key={room.id}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-black text-slate-900">{room.name}</p>
                  <p className="text-sm text-slate-600">{room.type}</p>
                  <p className="mt-2 text-xs text-slate-500">Capacity: {room.capacity}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteItem("room", room.id)}><Trash2 className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <form onSubmit={addFaculty} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <Field label="Faculty Name"><TextInput name="name" placeholder="Dr. Priya Sharma" /></Field>
          <Field label="Department"><TextInput name="department" placeholder="CSE" /></Field>
          <Field label="Max Weekly Hours"><TextInput name="maxHours" type="number" min="1" placeholder="12" /></Field>
          <Button><Plus className="mr-2 h-4 w-4" />Add Faculty</Button>
        </form>

        {filteredFaculty.map((person) => (
          <Card key={person.id}>
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-black text-slate-900">{person.name}</p>
                <p className="text-sm text-slate-600">{person.department}</p>
                <p className="mt-2 text-xs text-slate-500">Max: {person.maxHours} hrs/week</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => deleteItem("faculty", person.id)}><Trash2 className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-6">
      <style>{`
        ::view-transition-group(*),
        ::view-transition-old(*),
        ::view-transition-new(*) {
          animation-duration: 0.25s;
          animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
      `}</style>

      <div className="mx-auto max-w-7xl space-y-6">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center"
        >
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              <GraduationCap className="h-4 w-4" /> University Scheduler
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">University Timetable Generator</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Manage courses, rooms, and faculty. Generate a clean weekly timetable with room and teacher conflict checks.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setSixDayWeek((value) => !value)}><CalendarDays className="mr-2 h-4 w-4" />{sixDayWeek ? "Mon-Sat" : "Mon-Fri"}</Button>
            <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
            <Button onClick={generateTimetable}><Zap className="mr-2 h-4 w-4" />Generate Timetable</Button>
          </div>
        </motion.header>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard icon={Clock} label="Scheduled Slots" value={scheduledSlots} />
          <StatCard icon={BookOpen} label="Courses" value={courses.length} />
          <StatCard icon={Users} label="Faculty" value={faculty.length} />
          <StatCard icon={BarChart3} label="Free Periods" value={freeSlots} />
        </section>

        <main className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["courses", BookOpen, "Courses"],
                    ["rooms", Building2, "Rooms"],
                    ["faculty", Users, "Faculty"],
                  ].map(([tab, Icon, label]) => (
                    <Button key={tab} variant={activeTab === tab ? "default" : "outline"} onClick={() => setActiveTab(tab)}>
                      <Icon className="mr-1 h-4 w-4" /> {label}
                    </Button>
                  ))}
                </div>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="pl-9" />
                </div>
              </CardContent>
            </Card>
            {renderList()}
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-black text-slate-950">Weekly Timetable</h2>
                <p className="text-sm text-slate-500">Click a class card to view details or remove that slot.</p>
              </div>
              <Button variant="outline" onClick={() => setSchedule({})}><RefreshCw className="mr-2 h-4 w-4" />Clear</Button>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="sticky left-0 z-10 border-b border-r border-slate-200 bg-slate-100 p-3 text-left font-bold">Time</th>
                    {days.map((day) => <th key={day} className="border-b border-slate-200 p-3 text-left font-bold">{day}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((time) => (
                    <tr key={time}>
                      <td className="sticky left-0 z-10 border-r border-t border-slate-200 bg-white p-3 font-semibold text-slate-700">{time}</td>
                      {days.map((day) => {
                        const slot = schedule[`${day}-${time}`];
                        const course = slot ? courseById[slot.courseId] : null;
                        const person = slot ? facultyById[slot.facultyId] : null;
                        const room = slot ? roomById[slot.roomId] : null;
                        return (
                          <td key={`${day}-${time}`} className="h-28 border-t border-slate-200 p-2 align-top">
                            {slot && course ? (
                              <button onClick={() => setSelectedSlot({ ...slot, day, time })} className={`h-full w-full rounded-2xl border p-3 text-left shadow-sm transition hover:scale-[1.02] ${course.color}`}>
                                <p className="font-black">{course.code}</p>
                                <p className="text-xs font-medium">{course.name}</p>
                                <p className="mt-2 text-xs opacity-80">{person?.name}</p>
                                <p className="text-xs opacity-80">{room?.name}</p>
                              </button>
                            ) : (
                              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs font-medium text-slate-400">Free</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <AnimatePresence>
        {selectedSlot && (() => {
          const course = courseById[selectedSlot.courseId];
          const person = facultyById[selectedSlot.facultyId];
          const room = roomById[selectedSlot.roomId];
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
              onClick={() => setSelectedSlot(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 12 }}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-slate-500">{selectedSlot.day} • {selectedSlot.time}</p>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">{course?.code} - {course?.name}</h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedSlot(null)}><X className="h-5 w-5" /></Button>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-4"><b>Faculty:</b> {person?.name} ({person?.department})</div>
                  <div className="rounded-2xl bg-slate-50 p-4"><b>Room:</b> {room?.name} • {room?.type}</div>
                  <div className="rounded-2xl bg-slate-50 p-4"><b>Capacity:</b> {room?.capacity} seats • <b>Students:</b> {course?.students}</div>
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedSlot(null)}>Close</Button>
                  <Button variant="destructive" onClick={removeSlot}><Trash2 className="mr-2 h-4 w-4" />Remove Slot</Button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
