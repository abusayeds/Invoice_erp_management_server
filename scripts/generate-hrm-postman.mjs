import { writeFileSync } from "fs";

const companyAuth = () => [{ key: "Authorization", value: "Bearer {{company}}", type: "text" }];
const staffAuth = () => [{ key: "Authorization", value: "Bearer {{staff}}", type: "text" }];
const jsonHeaders = (token = "company") => [
  { key: "Authorization", value: `Bearer {{${token}}}`, type: "text" },
  { key: "Content-Type", value: "application/json", type: "text" },
];

const req = (name, method, url, opts = {}) => {
  const token = opts.token || "company";
  const hasBody = Boolean(opts.body);
  const r = {
    name,
    request: {
      method,
      header: hasBody ? jsonHeaders(token) : token === "staff" ? staffAuth() : companyAuth(),
      url,
    },
  };
  if (hasBody) r.request.body = { mode: "raw", raw: opts.body };
  return r;
};

const crudSetup = (label, path, createBody) => [
  req(`${label} — All`, "GET", `{{url}}hrm/setup/${path}?page=1&limit=10`),
  req(`${label} — Single`, "GET", `{{url}}hrm/setup/${path}/{{hrm_id}}`),
  req(`${label} — Add`, "POST", `{{url}}hrm/setup/${path}`, { body: createBody }),
  req(`${label} — Edit`, "PUT", `{{url}}hrm/setup/${path}/{{hrm_id}}`, { body: createBody }),
  req(`${label} — Delete`, "DELETE", `{{url}}hrm/setup/${path}/{{hrm_id}}`),
];

const crudWorkflow = (label, path, createBody, hasStatus = false) => {
  const items = [
    req(`${label} — All`, "GET", `{{url}}hrm/${path}?page=1&limit=10`),
    req(`${label} — Single`, "GET", `{{url}}hrm/${path}/{{hrm_id}}`),
    req(`${label} — Add`, "POST", `{{url}}hrm/${path}`, { body: createBody }),
    req(`${label} — Edit`, "PUT", `{{url}}hrm/${path}/{{hrm_id}}`, { body: createBody }),
    req(`${label} — Delete`, "DELETE", `{{url}}hrm/${path}/{{hrm_id}}`),
  ];
  if (hasStatus) {
    items.push(req(`${label} — Status`, "PUT", `{{url}}hrm/${path}/{{hrm_id}}/status`, { body: '{\n  "status": "approved"\n}' }));
  }
  return items;
};

const collection = {
  info: {
    _postman_id: "hrm-module-full-2026",
    name: "HRM (Full)",
    description:
      "**`url`** = `http://localhost:3000/api/v1/` (trailing slash required).\n\nPaths: `{{url}}hrm/...`\n\nVariables: `{{company}}`, `{{staff}}`, `{{staff_user_id}}`, `{{employee_profile_id}}`, `{{hrm_id}}`, `{{branch_id}}`, `{{payroll_id}}`, `{{entry_id}}`, `{{leave_id}}`, `{{attendance_id}}`.\n\nFull route parity with `src/modules/make_modules/hrm/`.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [],
};

collection.item.push({
  name: "01 — Dashboard & Mobile",
  item: [
    req("Dashboard — Home", "GET", "{{url}}hrm/dashboard"),
    req("Dashboard — Event Calendar", "GET", "{{url}}hrm/dashboard/event-calendar"),
    req("Mobile — Home", "GET", "{{url}}hrm/mobile/home", { token: "staff" }),
    req("Mobile — Events", "POST", "{{url}}hrm/mobile/events", {
      token: "staff",
      body: '{\n  "from_date": "2026-01-01",\n  "to_date": "2026-12-31"\n}',
    }),
    req("Mobile — Holidays List", "GET", "{{url}}hrm/mobile/holidays-list", { token: "staff" }),
    req("Mobile — Attendance History", "POST", "{{url}}hrm/mobile/attendance-history", {
      token: "staff",
      body: '{\n  "from_date": "2026-05-01",\n  "to_date": "2026-05-31"\n}',
    }),
    req("Mobile — Clock In/Out", "POST", "{{url}}hrm/mobile/clock-in-out", {
      token: "staff",
      body: '{\n  "type": "clockin"\n}',
    }),
    req("Mobile — Leaves", "GET", "{{url}}hrm/mobile/leaves", { token: "staff" }),
    req("Mobile — Leave Request", "POST", "{{url}}hrm/mobile/leave-request", {
      token: "staff",
      body: '{\n  "leave_type_id": "{{leave_type_id}}",\n  "start_date": "2026-06-01",\n  "end_date": "2026-06-02",\n  "reason": "Personal"\n}',
    }),
    req("Mobile — Leave Types", "GET", "{{url}}hrm/mobile/leave-types", { token: "staff" }),
  ],
});

const setupFolder = { name: "02 — System Setup (Master)", item: [] };
setupFolder.item.push(
  ...crudSetup("Branches", "branches", '{\n  "branch_name": "Head Office"\n}'),
  ...crudSetup("Departments", "departments", '{\n  "department_name": "Sales",\n  "branch_id": "{{branch_id}}"\n}'),
  ...crudSetup("Designations", "designations", '{\n  "designation_name": "Executive",\n  "branch_id": "{{branch_id}}",\n  "department_id": "{{department_id}}"\n}'),
  ...crudSetup("Shifts", "shifts", '{\n  "shift_name": "Morning",\n  "start_time": "09:00",\n  "end_time": "18:00"\n}'),
  ...crudSetup("Employee Document Types", "employee-document-types", '{\n  "document_name": "NID",\n  "is_required": true\n}'),
  ...crudSetup("Award Types", "award-types", '{\n  "name": "Best Performer"\n}'),
  ...crudSetup("Termination Types", "termination-types", '{\n  "termination_type": "Resignation"\n}'),
  ...crudSetup("Warning Types", "warning-types", '{\n  "warning_type_name": "Written Warning"\n}'),
  ...crudSetup("Complaint Types", "complaint-types", '{\n  "complaint_type": "Harassment"\n}'),
  ...crudSetup("Holiday Types", "holiday-types", '{\n  "holiday_type": "Public"\n}'),
  ...crudSetup("Document Categories", "document-categories", '{\n  "document_type": "Policy"\n}'),
  ...crudSetup("Announcement Categories", "announcement-categories", '{\n  "announcement_category": "General"\n}'),
  ...crudSetup("Event Types", "event-types", '{\n  "event_type": "Meeting"\n}'),
  ...crudSetup("Allowance Types", "allowance-types", '{\n  "name": "Transport"\n}'),
  ...crudSetup("Deduction Types", "deduction-types", '{\n  "name": "Tax"\n}'),
  ...crudSetup("Loan Types", "loan-types", '{\n  "name": "Personal Loan"\n}'),
  ...crudSetup("Leave Types", "leave-types", '{\n  "name": "Annual Leave",\n  "max_days_per_year": 12,\n  "is_paid": true\n}'),
  ...crudSetup("IP Restricts", "ip-restricts", '{\n  "ip": "127.0.0.1"\n}'),
  req("Working Days — Get", "GET", "{{url}}hrm/setup/working-days"),
  req("Working Days — Update", "PUT", "{{url}}hrm/setup/working-days", { body: '{\n  "working_days": [1, 2, 3, 4, 5]\n}' }),
  req("IP Restrict — Toggle", "POST", "{{url}}hrm/setup/ip-restricts/toggle-setting", { body: '{\n  "enabled": true\n}' })
);
collection.item.push(setupFolder);

collection.item.push({
  name: "03 — Employees",
  item: [
    req("Generate Employee ID", "GET", "{{url}}hrm/employees/generate-id"),
    req("Eligible Users", "GET", "{{url}}hrm/employees/eligible-users"),
    req("Lookups", "GET", "{{url}}hrm/employees/lookups"),
    req("Employees — All", "GET", "{{url}}hrm/employees?page=1&limit=10"),
    req("Employee — Single", "GET", "{{url}}hrm/employees/{{employee_profile_id}}"),
    req("Employee — Add", "POST", "{{url}}hrm/employees", {
      body: '{\n  "user_id": "{{staff_user_id}}",\n  "branch_id": "{{branch_id}}",\n  "department_id": "{{department_id}}",\n  "designation_id": "{{designation_id}}",\n  "shift_id": "{{shift_id}}",\n  "date_of_joining": "2026-01-15",\n  "basic_salary": 45000\n}',
    }),
    req("Employee — Edit", "PUT", "{{url}}hrm/employees/{{employee_profile_id}}", { body: '{\n  "basic_salary": 50000\n}' }),
    req("Employee — Delete", "DELETE", "{{url}}hrm/employees/{{employee_profile_id}}"),
    req("Employee Document — Delete", "DELETE", "{{url}}hrm/employees/{{employee_profile_id}}/documents/{{document_id}}"),
    req("Shifts by Employee", "GET", "{{url}}hrm/employees/{{employee_profile_id}}/shifts"),
  ],
});

collection.item.push({
  name: "04 — Leave",
  item: [
    req("Leave Types", "GET", "{{url}}hrm/leave/types"),
    req("Leave Balance — Index", "GET", "{{url}}hrm/leave/balance?employee_id={{staff_user_id}}"),
    req("Leave Balance — Single", "GET", "{{url}}hrm/leave/balance/{{staff_user_id}}/{{leave_type_id}}"),
    req("Leave Types by Employee", "GET", "{{url}}hrm/leave/types-by-employee/{{staff_user_id}}"),
    req("Leave — All", "GET", "{{url}}hrm/leave?page=1&limit=10"),
    req("Leave — Add", "POST", "{{url}}hrm/leave", {
      body: '{\n  "employee_id": "{{staff_user_id}}",\n  "leave_type_id": "{{leave_type_id}}",\n  "start_date": "2026-06-10",\n  "end_date": "2026-06-12",\n  "reason": "Family"\n}',
    }),
    req("Leave — Edit", "PUT", "{{url}}hrm/leave/{{leave_id}}", { body: '{\n  "reason": "Updated"\n}' }),
    req("Leave — Status", "PUT", "{{url}}hrm/leave/{{leave_id}}/status", {
      body: '{\n  "status": "approved",\n  "approver_comment": "OK"\n}',
    }),
    req("Leave — Delete", "DELETE", "{{url}}hrm/leave/{{leave_id}}"),
  ],
});

collection.item.push({
  name: "05 — Attendance",
  item: [
    req("Attendances — All", "GET", "{{url}}hrm/attendances?page=1&limit=10"),
    req("Attendance — Manual Add", "POST", "{{url}}hrm/attendances", {
      body: '{\n  "employee_id": "{{staff_user_id}}",\n  "shift_id": "{{shift_id}}",\n  "date": "2026-05-19",\n  "status": "present"\n}',
    }),
    req("Clock Status", "GET", "{{url}}hrm/attendances/clock-status", { token: "staff" }),
    req("Clock In", "POST", "{{url}}hrm/attendances/clock-in", { token: "staff" }),
    req("Clock Out", "POST", "{{url}}hrm/attendances/clock-out", { token: "staff" }),
    req("Clock In/Out", "POST", "{{url}}hrm/attendances/clock-in-out", { token: "staff", body: '{\n  "type": "clockin"\n}' }),
    req("History", "POST", "{{url}}hrm/attendances/history", {
      token: "staff",
      body: '{\n  "from_date": "2026-05-01",\n  "to_date": "2026-05-31"\n}',
    }),
    req("Attendance — Edit", "PUT", "{{url}}hrm/attendances/{{attendance_id}}", { body: '{\n  "status": "present"\n}' }),
    req("Attendance — Delete", "DELETE", "{{url}}hrm/attendances/{{attendance_id}}"),
  ],
});

collection.item.push({
  name: "06 — Payroll",
  item: [
    req("Set Salary — List", "GET", "{{url}}hrm/payroll/set-salary"),
    req("Set Salary — Get", "GET", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}"),
    req("Set Salary — Update", "PUT", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}", {
      body: '{\n  "basic_salary": 50000\n}',
    }),
    req("Allowance — Add", "POST", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}/allowances", {
      body: '{\n  "allowance_type_id": "{{allowance_type_id}}",\n  "type": "fixed",\n  "amount": 5000\n}',
    }),
    req("Allowance — Edit", "PUT", "{{url}}hrm/payroll/allowances/{{hrm_id}}", { body: '{\n  "amount": 6000\n}' }),
    req("Allowance — Delete", "DELETE", "{{url}}hrm/payroll/allowances/{{hrm_id}}"),
    req("Deduction — Add", "POST", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}/deductions", {
      body: '{\n  "deduction_type_id": "{{deduction_type_id}}",\n  "type": "fixed",\n  "amount": 1000\n}',
    }),
    req("Deduction — Edit", "PUT", "{{url}}hrm/payroll/deductions/{{hrm_id}}", { body: '{\n  "amount": 1200\n}' }),
    req("Deduction — Delete", "DELETE", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}/deductions/{{hrm_id}}"),
    req("Loan — Add", "POST", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}/loans", {
      body: '{\n  "title": "Advance",\n  "loan_type_id": "{{loan_type_id}}",\n  "type": "fixed",\n  "amount": 10000\n}',
    }),
    req("Loan — Edit", "PUT", "{{url}}hrm/payroll/loans/{{hrm_id}}", { body: '{\n  "amount": 8000\n}' }),
    req("Loan — Delete", "DELETE", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}/loans/{{hrm_id}}"),
    req("Overtime — Add", "POST", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}/overtimes", {
      body: '{\n  "title": "OT",\n  "hours": 10,\n  "rate": 500\n}',
    }),
    req("Overtime — Edit", "PUT", "{{url}}hrm/payroll/overtimes/{{hrm_id}}", { body: '{\n  "hours": 12\n}' }),
    req("Overtime — Delete", "DELETE", "{{url}}hrm/payroll/set-salary/{{employee_profile_id}}/overtimes/{{hrm_id}}"),
    req("Payrolls — All", "GET", "{{url}}hrm/payroll?page=1&limit=10"),
    req("Payroll — Add", "POST", "{{url}}hrm/payroll", {
      body: '{\n  "title": "May 2026",\n  "payroll_frequency": "monthly",\n  "pay_period_start": "2026-05-01",\n  "pay_period_end": "2026-05-31"\n}',
    }),
    req("Payroll — Single", "GET", "{{url}}hrm/payroll/{{payroll_id}}"),
    req("Payroll — Edit", "PUT", "{{url}}hrm/payroll/{{payroll_id}}", { body: '{\n  "title": "May 2026 v2"\n}' }),
    req("Payroll — Delete", "DELETE", "{{url}}hrm/payroll/{{payroll_id}}"),
    req("Payroll — Run", "POST", "{{url}}hrm/payroll/{{payroll_id}}/run"),
    req("Payslip — Print", "GET", "{{url}}hrm/payroll/entries/{{entry_id}}/print"),
    req("Payslip — Delete", "DELETE", "{{url}}hrm/payroll/entries/{{entry_id}}"),
    req("Payslip — Pay", "PATCH", "{{url}}hrm/payroll/entries/{{entry_id}}/pay"),
  ],
});

const wf = { name: "07 — Workflow (HR Actions)", item: [] };
wf.item.push(
  req("Events — Calendar", "GET", "{{url}}hrm/events/event-calendar"),
  ...crudWorkflow("Holidays", "holidays", '{\n  "name": "Eid",\n  "start_date": "2026-06-01",\n  "end_date": "2026-06-03"\n}'),
  ...crudWorkflow("Awards", "awards", '{\n  "employee_id": "{{staff_user_id}}"\n}'),
  ...crudWorkflow("Promotions", "promotions", '{\n  "employee_id": "{{staff_user_id}}"\n}', true),
  ...crudWorkflow("Resignations", "resignations", '{\n  "employee_id": "{{staff_user_id}}"\n}', true),
  req("Resignation — Status Path", "PUT", "{{url}}hrm/resignations/{{hrm_id}}/status/approved"),
  ...crudWorkflow("Terminations", "terminations", '{\n  "employee_id": "{{staff_user_id}}"\n}', true),
  ...crudWorkflow("Warnings", "warnings", '{\n  "employee_id": "{{staff_user_id}}",\n  "subject": "Late"\n}'),
  req("Warning — Response", "PUT", "{{url}}hrm/warnings/{{hrm_id}}/response", {
    token: "staff",
    body: '{\n  "employee_response": "Acknowledged"\n}',
  }),
  ...crudWorkflow("Complaints", "complaints", '{\n  "employee_id": "{{staff_user_id}}"\n}', true),
  ...crudWorkflow("Employee Transfers", "employee-transfers", '{\n  "employee_id": "{{staff_user_id}}"\n}', true),
  ...crudWorkflow("Events", "events", '{\n  "title": "Meet",\n  "start_date": "2026-05-20"\n}', true),
  ...crudWorkflow("Announcements", "announcements", '{\n  "title": "Notice"\n}', true),
  ...crudWorkflow("Documents", "documents", '{\n  "title": "Handbook"\n}', true),
  ...crudWorkflow("Acknowledgments", "acknowledgments", '{\n  "employee_id": "{{staff_user_id}}"\n}', true)
);
collection.item.push(wf);

collection.item.push({
  name: "08 — Lookups",
  item: [
    req("Warning Bies", "GET", "{{url}}hrm/users/{{staff_user_id}}/warning-bies"),
    req("Warning Types", "GET", "{{url}}hrm/users/{{staff_user_id}}/warning-types"),
    req("Event Type Approved Bies", "GET", "{{url}}hrm/event-types/{{hrm_id}}/approved-bies"),
  ],
});

const out = "postman/Hrm.postman_collection.json";
writeFileSync(out, JSON.stringify(collection, null, 2), "utf8");

let count = 0;
const walk = (items) => {
  for (const i of items) {
    if (i.request) count++;
    if (i.item) walk(i.item);
  }
};
walk(collection.item);
console.log(`Wrote ${out}: ${count} requests, ${collection.item.length} folders`);
