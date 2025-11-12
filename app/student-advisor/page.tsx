"use client";

import { useMemo, useState } from "react";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

type Message = {
  from: "advisor" | "assistant";
  text: string;
  timestamp: string;
};

type Student = {
  id: number;
  name: string;
  semester: string;
  cgpa: string;
  interests: string[];
  email: string;
  phone: string;
  messages: Message[];
};

const SEMESTER_OPTIONS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];

const CGPA_OPTIONS = Array.from({ length: 51 }, (_, index) =>
  (5 + index * 0.1).toFixed(1)
);

const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Aarav Patel",
    semester: "5th Semester",
    cgpa: "8.6",
    interests: ["Machine Learning", "Data Science"],
    email: "aarav.patel@example.edu",
    phone: "+1 (555) 240-1123",
    messages: [
      {
        from: "advisor",
        text: "I'm meeting with Aarav Patel (CGPA 8.6, semester 5). He's asking if a Data Science minor is realistic with his current load.",
        timestamp: "09:02"
      },
      {
        from: "assistant",
        text: "Yes. His grades and semester placement support it. Recommend enrolling in the Advanced ML lab next term and securing a data-centric practicum to reinforce the minor.",
        timestamp: "09:03"
      },
      {
        from: "advisor",
        text: "Great. I want to reinforce his machine learning ambitions—what specific campus resources should I highlight?",
        timestamp: "09:05"
      },
      {
        from: "assistant",
        text: "Point him toward the Data Science Society, the Kaggle-ready analytics bootcamp, and connect him with alumni ML mentors for mock project reviews.",
        timestamp: "09:06"
      }
    ]
  },
  {
    id: 2,
    name: "Emily Chen",
    semester: "7th Semester",
    cgpa: "9.1",
    interests: ["Cloud Computing", "DevOps"],
    email: "emily.chen@example.edu",
    phone: "+1 (555) 671-8840",
    messages: [
      {
        from: "advisor",
        text: "Emily Chen just secured an AWS internship. I need an elective mix that keeps her challenged without overload.",
        timestamp: "11:21"
      },
      {
        from: "assistant",
        text: "Recommend Serverless Architectures, DevOps Automation Lab, and capstone credits that document her AWS deliverables. That combination aligns with her internship.",
        timestamp: "11:22"
      },
      {
        from: "advisor",
        text: "Noted. Any talking points I should prep before our advising session?",
        timestamp: "11:23"
      },
      {
        from: "assistant",
        text: "Open by celebrating her 9.1 CGPA, suggest pitching her internship work for the cloud research showcase, and line up faculty intros for cloud-native research roles.",
        timestamp: "11:24"
      }
    ]
  },
  {
    id: 3,
    name: "Mateo Rivera",
    semester: "3rd Semester",
    cgpa: "7.8",
    interests: ["Robotics", "Embedded Systems"],
    email: "mateo.rivera@example.edu",
    phone: "+1 (555) 339-6742",
    messages: [
      {
        from: "advisor",
        text: "Mateo Rivera wants robotics exposure but he's cautious with a 7.8 CGPA. I need a plan that builds confidence.",
        timestamp: "14:45"
      },
      {
        from: "assistant",
        text: "Start with a four-week embedded systems sprint, pair him with Robotics Innovation Lab mentors, and enroll him in the Intro Robotics Hackathon to practice.",
        timestamp: "14:46"
      },
      {
        from: "advisor",
        text: "Thanks. Can you give me three micro-goals to hand him before midterms?",
        timestamp: "14:48"
      },
      {
        from: "assistant",
        text: "1) Finish the Arduino prototyping module, 2) schedule two control-systems tutoring sessions, 3) document a mini robotics build for his portfolio review.",
        timestamp: "14:49"
      }
    ]
  }
];

const StudentListItem = ({
  student,
  isActive,
  onSelect
}: {
  student: Student;
  isActive: boolean;
  onSelect: (student: Student) => void;
}) => (
  <button
    onClick={() => onSelect(student)}
    className={`w-full rounded-lg px-4 py-3 text-left transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-900 shadow-inner shadow-blue-200/70"
        : "text-slate-600 hover:bg-slate-100"
    }`}
  >
    <p className="font-semibold">{student.name}</p>
    <p className="text-sm text-slate-500">{student.semester}</p>
  </button>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const isAdvisor = message.from === "advisor";
  return (
    <div className={`flex ${isAdvisor ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs rounded-2xl px-4 py-3 text-sm shadow md:max-w-md ${
          isAdvisor
            ? "bg-blue-600 text-white shadow-lg shadow-blue-300/40"
            : "border border-slate-200 bg-white text-slate-700 shadow"
        }`}
      >
        <p className="font-medium capitalize">
          {isAdvisor ? "Advisor" : "AI Advisor"}
        </p>
        <p className="mt-1 leading-relaxed">{message.text}</p>
        <span className="mt-2 block text-xs opacity-70">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

const StudentDetails = ({ student }: { student: Student }) => (
  <div className="space-y-6">
    <section>
      <h2 className="text-base font-semibold text-slate-900">Student Details</h2>
      <p className="text-sm text-slate-500">
        Quick snapshot of academics and contact touchpoints.
      </p>
    </section>

    <div className="grid gap-4">
      <DetailCard
        title="Semester"
        value={student.semester}
        icon={<AcademicCapIcon className="h-5 w-5 text-blue-500" />}
      />
      <DetailCard
        title="CGPA"
        value={student.cgpa}
        accent
        icon={<AcademicCapIcon className="h-5 w-5 text-blue-500" />}
      />
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-blue-200/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Interested Fields
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {student.interests.map((interest) => (
            <li
              key={interest}
              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {interest}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-blue-200/40">
        <DetailLink
          label="Email"
          value={student.email}
          href={`mailto:${student.email}`}
          icon={<EnvelopeIcon className="h-5 w-5 text-blue-500" />}
        />
        <DetailLink
          label="Phone"
          value={student.phone}
          href={`tel:${student.phone}`}
          icon={<PhoneIcon className="h-5 w-5 text-blue-500" />}
        />
      </div>
    </div>
  </div>
);

const DetailCard = ({
  title,
  value,
  accent,
  icon
}: {
  title: string;
  value: string;
  accent?: boolean;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-blue-200/40">
    {icon && (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        {icon}
      </div>
    )}
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p
        className={`mt-1 text-lg font-semibold ${
          accent ? "text-blue-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);

const DetailLink = ({
  label,
  value,
  href,
  icon
}: {
  label: string;
  value: string;
  href: string;
  icon?: React.ReactNode;
}) => (
  <a
    href={href}
    className="flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50"
  >
    {icon}
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-sm font-medium text-blue-700">{value}</p>
    </div>
  </a>
);

export default function StudentAdvisorPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(
    INITIAL_STUDENTS[0]?.id ?? 0
  );
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    semester: "",
    cgpa: "",
    interests: "",
    email: "",
    phone: ""
  });

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId),
    [students, selectedStudentId]
  );

  if (!selectedStudent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">No students available.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <aside className="hidden w-72 flex-shrink-0 flex-col gap-4 border-r border-slate-200 bg-white px-4 py-6 shadow-sm lg:flex">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Student Advisor</h1>
          <p className="text-sm text-slate-500">
            Select a student to craft plans with the AI advisor.
          </p>
        </div>
        <div className="space-y-2 overflow-y-auto pr-1">
          {students.map((student) => (
            <StudentListItem
              key={student.id}
              student={student}
              isActive={student.id === selectedStudent.id}
              onSelect={(choice) => setSelectedStudentId(choice.id)}
            />
          ))}
        </div>
        <button
          onClick={() => {
            setIsOnboardingOpen(true);
            setOnboardingStep(0);
          }}
          className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          + Start New Session
        </button>
      </aside>

      <main className="flex flex-1 flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100/70 overflow-hidden">
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Select Student
          </label>
          <select
            value={selectedStudent.id}
            onChange={(event) => setSelectedStudentId(Number(event.target.value))}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {selectedStudent.name}
            </h2>
            <p className="text-sm text-slate-500">
              AI-Advised Planning · {selectedStudent.semester}
            </p>
          </div>
          <button className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100">
            Export Summary
          </button>
        </header>

        <section className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6 pb-24">
          {selectedStudent.messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </section>

        <footer className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-blue-200/40">
            <label className="text-sm font-medium text-slate-700">
              Draft a prompt
            </label>
            <textarea
              rows={3}
              placeholder="Ask the AI for tailored plans, resource lists, or next-step checklists..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2 text-xs text-slate-500">
                <span>Auto-summarize</span>
                <span>•</span>
                <span>Generate outreach email</span>
              </div>
              <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-blue-700">
                Send Prompt
              </button>
            </div>
          </div>
        </footer>
      </main>

      <aside className="hidden w-80 flex-shrink-0 border-l border-slate-200 bg-white px-6 py-6 shadow-sm lg:block">
        <StudentDetails student={selectedStudent} />
      </aside>

      {isOnboardingOpen && (
        <OnboardingModal
          step={onboardingStep}
          formData={formData}
          onClose={() => setIsOnboardingOpen(false)}
          onNext={() => setOnboardingStep((prev) => Math.min(prev + 1, 2))}
          onBack={() => setOnboardingStep((prev) => Math.max(prev - 1, 0))}
          onChange={(updates) =>
            setFormData((prev) => ({
              ...prev,
              ...updates
            }))
          }
          onSubmit={() => {
            const interestList = formData.interests
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean);

            const newStudent: Student = {
              id: Date.now(),
              name: formData.name || "New Student",
              semester: formData.semester || "Semester TBD",
              cgpa: formData.cgpa || "CGPA TBD",
              interests: interestList.length ? interestList : ["Advising"],
              email: formData.email || "advising@example.edu",
              phone: formData.phone || "+1 (555) 000-0000",
              messages: [
                {
                  from: "advisor",
                  text: `Preparing for my first session with ${formData.name ||
                    "this student"}. Need an overview to begin.`,
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                },
                {
                  from: "assistant",
                  text:
                    "Here is a starter agenda: review academic standing, clarify interests, and co-create next semester goals.",
                  timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                }
              ]
            };

            setStudents((prev) => [newStudent, ...prev]);
            setSelectedStudentId(newStudent.id);
            setIsOnboardingOpen(false);
            setFormData({
              name: "",
              semester: "",
              cgpa: "",
              interests: "",
              email: "",
              phone: ""
            });
            setOnboardingStep(0);
          }}
        />
      )}
    </div>
  );
}

type OnboardingModalProps = {
  step: number;
  formData: {
    name: string;
    semester: string;
    cgpa: string;
    interests: string;
    email: string;
    phone: string;
  };
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  onChange: (updates: Partial<OnboardingModalProps["formData"]>) => void;
};

const OnboardingModal = ({
  step,
  formData,
  onClose,
  onNext,
  onBack,
  onSubmit,
  onChange
}: OnboardingModalProps) => {
  const steps = [
    {
      title: "Student Overview",
      description: "Capture the student's identity and current academic status.",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Full Name</label>
            <input
              value={formData.name}
              onChange={(event) => onChange({ name: event.target.value })}
              placeholder="Ex: Priya Sharma"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Semester</label>
              <div className="relative mt-1">
                <select
                  value={formData.semester}
                  onChange={(event) => onChange({ semester: event.target.value })}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select semester
                  </option>
                  {SEMESTER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  ▾
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">CGPA</label>
              <div className="relative mt-1">
                <select
                  value={formData.cgpa}
                  onChange={(event) => onChange({ cgpa: event.target.value })}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select CGPA
                  </option>
                  {CGPA_OPTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  ▾
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Interests & Goals",
      description: "What themes, industries, or disciplines excite this student?",
      content: (
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-700">
            Primary Interests (comma separated)
          </label>
          <textarea
            value={formData.interests}
            onChange={(event) => onChange({ interests: event.target.value })}
            placeholder="Ex: AI Ethics, FinTech, Community Outreach"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            rows={4}
          />
        </div>
      )
    },
    {
      title: "Contact & Launch",
      description: "Provide quick contact info so you can follow-up after the session.",
      content: (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                value={formData.email}
                onChange={(event) => onChange({ email: event.target.value })}
                placeholder="Ex: priya.sharma@example.edu"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                value={formData.phone}
                onChange={(event) => onChange({ phone: event.target.value })}
                placeholder="Ex: +1 (555) 123-4567"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
            We draft a starter conversation to help you begin the AI-assisted advising
            session as soon as you launch.
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-md border border-red-300 bg-red-500 text-lg font-semibold text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label="Close onboarding"
        >
          ×
        </button>

        <div className="flex items-center justify-between border-b border-slate-200 pl-6 pr-16 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
              New Session Setup
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              {steps[step].title}
            </h2>
            <p className="text-sm text-slate-500">{steps[step].description}</p>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Step {step + 1} of {steps.length}
          </div>
        </div>

        <div className="px-6 py-6">{steps[step].content}</div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === step ? "bg-blue-500" : "bg-slate-300"
                }`}
              ></span>
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={onBack}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/60"
              >
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button
                onClick={onNext}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onSubmit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Launch Session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

