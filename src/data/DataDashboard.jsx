import {
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";

export const studentStats = [
  {
    title: "Enrollment Status",
    value: "Enrolled",
    description: "First Semester",
    icon: CheckCircle2,
    color: "green",
  },
  {
    title: "Current Units",
    value: "21",
    description: "Total enrolled units",
    icon: BookOpen,
    color: "blue",
  },
  {
    title: "Subjects",
    value: "6",
    description: "Currently enrolled",
    icon: GraduationCap,
    color: "purple",
  },
  {
    title: "Service Requests",
    value: "1",
    description: "Pending request",
    icon: ClipboardList,
    color: "orange",
  },
];

export const facultyStats = [
  {
    title: "Teaching Load",
    value: "18 Units",
    description: "Current semester",
    icon: BookOpen,
    color: "blue",
  },
  {
    title: "Assigned Classes",
    value: "5",
    description: "Active classes",
    icon: GraduationCap,
    color: "purple",
  },
  {
    title: "Student Advisees",
    value: "42",
    description: "Assigned students",
    icon: Users,
    color: "green",
  },
  {
    title: "Service Requests",
    value: "2",
    description: "Pending requests",
    icon: ClipboardList,
    color: "orange",
  },
];

export const adminStats = [
  {
    title: "Total Students",
    value: "5,231",
    description: "Registered students",
    icon: GraduationCap,
    color: "blue",
  },
  {
    title: "Total Faculty",
    value: "212",
    description: "Active faculty members",
    icon: Users,
    color: "purple",
  },
  {
    title: "Pending Requests",
    value: "67",
    description: "Awaiting action",
    icon: ClipboardList,
    color: "orange",
  },
  {
    title: "Announcements",
    value: "12",
    description: "Active announcements",
    icon: Bell,
    color: "green",
  },
];

export const announcements = [
  {
    id: 1,
    title: "Enrollment Period Extended",
    description:
      "The enrollment period for the first semester has been extended.",
    category: "Enrollment",
    date: "October 15, 2026",
  },
  {
    id: 2,
    title: "Midterm Examination Schedule",
    description:
      "The midterm examination schedule is now available for viewing.",
    category: "Academic",
    date: "October 14, 2026",
  },
  {
    id: 3,
    title: "Updated Library Operating Hours",
    description:
      "The university library has announced its updated operating hours.",
    category: "Campus",
    date: "October 13, 2026",
  },
];

export const serviceRequests = [
  {
    id: "SR-1058",
    service: "Document Verification",
    submittedBy: "A. Santos",
    date: "October 15, 2026",
    status: "Processing",
  },
  {
    id: "SR-1057",
    service: "Enrollment Concern",
    submittedBy: "M. Reyes",
    date: "October 14, 2026",
    status: "Under Review",
  },
  {
    id: "SR-1056",
    service: "Portal Access",
    submittedBy: "J. Cruz",
    date: "October 14, 2026",
    status: "Completed",
  },
];