# HRM API — Frontend Integration Guide

Laravel `workdo/Hrm` module ported to Node. Use this document for web admin UI and mobile employee app.

---

## Base URL & Postman

| Item | Value |
|------|--------|
| **API prefix** | `/api/v1/hrm` |
| **Full example** | `http://localhost:3000/api/v1/hrm/employees` |
| **Postman** | `postman/Hrm.postman_collection.json` |
| **Collection variable** | `url` = `http://localhost:3000/api/v1/` (trailing slash required) |
| **Path pattern** | `{{url}}hrm/employees` — no extra `/` before `hrm` |

---

## Authentication

All routes require JWT:

```http
Authorization: Bearer <access_token>
```

| Role | Typical use |
|------|-------------|
| `company` | Full HRM admin (all permissions on company account) |
| `hr` | HR manager (same HRM permission set as configured) |
| `staff` | Employee self-service + mobile APIs |

**Company context**

- Logged-in **company** user: tenant id = that user's `_id`.
- **staff** / **hr**: tenant id = `user.companyId` from JWT.

Unauthorized / wrong company → `401` or `400` (`Company context is required`).

---

## Response envelope

Every endpoint uses `sendResponse`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "List retrieved",
  "pagination": {
    "totalPage": 1,
    "currentPage": 1,
    "prevPage": 1,
    "nextPage": 1,
    "totalData": 2
  },
  "data": [
    { "_id": "...", "branch_name": "Head Office" }
  ]
}
```

**HRM list endpoints (standard):**

- **`pagination`** — top-level; from `queryBuilder.calculatePagination()` (`totalData` count is **inside** `pagination`, not a sibling of `data`).
- **`data`** — **array only** on list routes (never `{ data: [], pagination: {}, totalData: n }` nested inside `data`).
- Helper: `sendHrmPaginatedList()` in `hrm/shared/hrm.response.ts` — use for all new HRM list controllers.

On errors, `success: false`, `message` describes the issue, `statusCode` matches HTTP status.

### List query parameters (shared `queryBuilder`)

| Query | Example | Notes |
|-------|---------|--------|
| `page` | `1` | Default `1` |
| `limit` | `10` | Default `10` |
| `searchTerm` | `EMP2026` | Searches configured fields per resource |
| `sort` | `-createdAt` | Prefix `-` = descending |
| `fields` | `name,email` | Sparse field selection |
| Filter fields | `status=pending` | Model fields as query keys |

---

## Errors (`AppError`)

| HTTP | When |
|------|------|
| `400` | Validation (dates, missing `user_id`, working days not set, on leave/holiday, etc.) |
| `401` | Missing/invalid token |
| `403` | Missing permission (`Permission denied`) or IP not allowed for clock |
| `404` | Record not found |
| `409` | Duplicate (employee profile, attendance same day) |

Frontend: show `message` from JSON body; do not rely only on status text.

---

## Critical ID conventions

Read this before wiring forms.

| Concept | Mongo collection | ID to send in API |
|---------|------------------|-------------------|
| **Company tenant** | all HRM docs | `user_id` on document = company owner's `User._id` (set server-side) |
| **Employee profile** | `hrmemployees` | `_id` → use in `/employees/:id`, `/payroll/set-salary/:employeeId` |
| **Staff login user** | `users` (`role: staff` / `hr`) | `_id` → use as `employee_id` on **leave**, **attendance**, **payroll entries**, allowances |
| **Link** | profile.`employee_user_id` | Points to staff `User._id` |

**Rules**

1. `POST /hrm/employees` → body `user_id` (or `employee_user_id`) = **staff User id** (not profile id).
2. `POST /hrm/leave` → `employee_id` = **staff User id**; omit for self-request (uses JWT user).
3. `POST /hrm/attendances` → `employee_id` = **staff User id**.
4. `GET /hrm/payroll/set-salary/:employeeId` → `:employeeId` = **employee profile** `_id`.
5. `GET /hrm/leave/balance/:employeeId/:leaveTypeId` → `:employeeId` = **staff User id**.

---

## Permissions

HRM defines **288** permission strings (see `src/modules/make_modules/hrm/shared/hrm.permissions.ts`), merged in `src/utils/permissions.ts`.

**Pattern**

| Action | Permission example |
|--------|-------------------|
| List (admin) | `manage-employees` |
| See all vs own | `manage-any-employees` / `manage-own-employees` |
| Create | `create-employees` |
| Edit | `edit-employees` |
| Delete | `delete-employees` |
| Status change | `manage-leave-status`, `manage-promotions-status`, … |

**Roles (default)**

- `company` / `hr` — full HRM set (when assigned on user).
- `staff` — subset for mobile: clock-in/out, own leave, own attendance history, etc.

If UI gets `403`, check user's `permissions[]` on login response.

---

## Laravel mobile API mapping

| Laravel (`/api/hrm/...`) | Node |
|--------------------------|------|
| `GET home` | `GET /hrm/mobile/home` |
| `POST events` | `POST /hrm/mobile/events` |
| `GET holidays-list` | `GET /hrm/mobile/holidays-list` |
| `POST attendence-history` | `POST /hrm/mobile/attendance-history` |
| `POST clock-in-out` | `POST /hrm/mobile/clock-in-out` |
| `GET get-leaves` | `GET /hrm/mobile/leaves` |
| `POST leave-request` | `POST /hrm/mobile/leave-request` |
| `GET get-leaves-types` | `GET /hrm/mobile/leave-types` |

Mobile clock body:

```json
{ "type": "clockin" }
```

or `"clockout"`. Server reads client IP from `X-Forwarded-For` or `req.ip` when IP restrict is on.

---

## 1. Dashboard

| Method | Path | Permission (typical) | Description |
|--------|------|----------------------|-------------|
| `GET` | `/hrm/dashboard` | implicit | Company stats or employee view (`data.view`: `company` \| `employee`) |
| `GET` | `/hrm/dashboard/event-calendar` | — | Events in date range (query `from_date`, `to_date`) |

**Company `data.stats` (example keys):** `total_employees`, `present_today`, `absent_today`, `on_leave`, `pending_leaves`, `total_branches`, `total_departments`, …

**Employee `data`:** `clock`, `on_leave`, `events`.

---

## 2. Mobile (`/hrm/mobile/*`)

Same auth as web. Intended for **staff** JWT.

| Method | Path | Body / query |
|--------|------|----------------|
| `GET` | `/mobile/home` | — |
| `POST` | `/mobile/events` | `{ "from_date?", "to_date?" }` |
| `GET` | `/mobile/holidays-list` | pagination query |
| `POST` | `/mobile/attendance-history` | `{ "from_date?", "to_date?" }` |
| `POST` | `/mobile/clock-in-out` | `{ "type": "clockin" \| "clockout" }` |
| `GET` | `/mobile/leaves` | pagination |
| `POST` | `/mobile/leave-request` | leave create body (see §5) |
| `GET` | `/mobile/leave-types` | pagination |

Web equivalents: `/hrm/attendances/clock-in`, `clock-out`, `clock-status`.

---

## 3. System setup (`/hrm/setup/*`)

Each master resource supports the same CRUD shape:

`GET|POST /setup/{resource}`  
`GET|PUT|DELETE /setup/{resource}/:id`

| Resource path | Main field |
|---------------|------------|
| `branches` | `branch_name` |
| `departments` | `department_name`, `branch_id` |
| `designations` | `designation_name`, `branch_id`, `department_id` |
| `shifts` | `shift_name`, times, break, `is_night_shift` |
| `employee-document-types` | `document_name` |
| `award-types`, `termination-types`, `warning-types`, `complaint-types` | type name |
| `holiday-types`, `document-categories`, `announcement-categories`, `event-types` | name |
| `allowance-types`, `deduction-types`, `loan-types` | `name` |
| `leave-types` | `name`, `max_days_per_year`, `is_paid`, `color` |
| `ip-restricts` | `ip` |

**Settings**

| Method | Path | Body |
|--------|------|------|
| `GET` | `/setup/working-days` | — |
| `PUT` | `/setup/working-days` | `{ "working_days": [1,2,3,4,5] }` — `0`=Sun … `6`=Sat |
| `POST` | `/setup/ip-restricts/toggle-setting` | `{ "enabled": true }` |

---

## 4. Employees (`/hrm/employees`)

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/generate-id` | `{ "employee_id": "EMP20260001" }` |
| `GET` | `/eligible-users` | Staff users without profile |
| `GET` | `/lookups` | branches, departments, designations, shifts, document types |
| `GET` | `/` | List (filters: `branch_id`, `department_id`, `employment_type`, `gender`) |
| `GET` | `/:id` | Profile + `documents[]` |
| `POST` | `/` | Create (see body below) |
| `PUT` | `/:id` | Update profile (`user_id` stripped) |
| `DELETE` | `/:id` | Soft delete |
| `DELETE` | `/:employeeId/documents/:documentId` | Soft delete document |

**Create employee — minimum body**

```json
{
  "user_id": "<staff_user_id>",
  "branch_id": "<objectId>",
  "department_id": "<objectId>",
  "designation_id": "<objectId>",
  "shift_id": "<objectId>",
  "gender": "Male",
  "employment_type": "0",
  "date_of_joining": "2026-01-15",
  "basic_salary": 45000
}
```

Optional: address, bank, emergency contact, `employee_id` (auto-generated if omitted).

---

## 5. Leave (`/hrm/leave`)

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/types` | All leave types |
| `GET` | `/balance?employee_id=` | Per-type balance for one staff user |
| `GET` | `/balance/:employeeId/:leaveTypeId` | Single type balance |
| `GET` | `/types-by-employee/:employeeId` | Types (staff user id) |
| `GET` | `/` | Applications list |
| `POST` | `/` | Create application |
| `PUT` | `/:id` | Edit dates/reason (pending) |
| `PUT` | `/:id/status` | Approve/reject |
| `DELETE` | `/:id` | Soft delete |

**Create leave**

```json
{
  "employee_id": "<staff_user_id_optional>",
  "leave_type_id": "<objectId>",
  "start_date": "2026-06-01",
  "end_date": "2026-06-03",
  "reason": "Family event",
  "attachment": "file-url-or-id"
}
```

**Status update**

```json
{
  "status": "approved",
  "approver_comment": "OK"
}
```

`status`: `pending` | `approved` | `rejected`.

**Balance response**

```json
{
  "leave_type_id": "...",
  "max_days_per_year": 12,
  "used_days": 3,
  "balance": 9
}
```

---

## 6. Attendance (`/hrm/attendances`)

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/` | Admin list (`employee_id` filter) |
| `POST` | `/` | Manual entry (admin) |
| `GET` | `/clock-status` | Today's clock state (logged-in staff) |
| `POST` | `/clock-in` | Staff clock in |
| `POST` | `/clock-out` | Staff clock out |
| `POST` | `/clock-in-out` | `{ "type": "clockin" \| "clockout" }` |
| `POST` | `/history` | Own history (body date range) |
| `PUT` | `/:id` | Edit record |
| `DELETE` | `/:id` | Soft delete |

**Manual create**

```json
{
  "employee_id": "<staff_user_id>",
  "shift_id": "<objectId>",
  "date": "2026-05-19",
  "clock_in": "2026-05-19T09:00:00.000Z",
  "clock_out": "2026-05-19T18:00:00.000Z",
  "status": "present",
  "notes": ""
}
```

`status`: `present` | `half day` | `absent`.

**Clock status `data`**

```json
{
  "can_clock_in": true,
  "can_clock_out": false,
  "today_attendance": { },
  "pending_clock_out": null
}
```

---

## 7. Payroll (`/hrm/payroll`)

### Set salary

| Method | Path | `:employeeId` = profile `_id` |
|--------|------|----------------------------------|
| `GET` | `/set-salary` | Employee list with salary summary |
| `GET` | `/set-salary/:employeeId` | allowances, deductions, loans, overtimes |
| `PUT` | `/set-salary/:employeeId` | `{ basic_salary, hours_per_day, days_per_week, rate_per_hour }` |

**Salary components**

| Method | Path |
|--------|------|
| `POST` | `/set-salary/:employeeId/allowances` |
| `PUT` | `/allowances/:id` |
| `DELETE` | `/allowances/:id` |
| `POST` | `/set-salary/:employeeId/deductions` |
| `PUT` | `/deductions/:id` |
| `DELETE` | `/set-salary/:employeeId/deductions/:id` |
| `POST` | `/set-salary/:employeeId/loans` |
| `PUT` | `/loans/:id` |
| `DELETE` | `/set-salary/:employeeId/loans/:id` |
| `POST` | `/set-salary/:employeeId/overtimes` |
| `PUT` | `/overtimes/:id` |
| `DELETE` | `/set-salary/:employeeId/overtimes/:id` |

Allowance/deduction body: `{ "allowance_type_id", "type": "fixed"|"percentage", "amount": 5000 }`.

### Payroll run

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/` | List payrolls |
| `POST` | `/` | Create payroll period |
| `GET` | `/entries/:entryId/print` | Payslip JSON for PDF UI |
| `DELETE` | `/entries/:entryId` | Remove entry, recalc totals |
| `PATCH` | `/entries/:entryId/pay` | Mark paid |
| `PUT` | `/:id` | Update title/dates/status |
| `DELETE` | `/:id` | Soft delete payroll + entries |
| `GET` | `/:id` | Payroll + `entries[]` |
| `POST` | `/:id/run` | Generate payslips for all employees |

**Create payroll**

```json
{
  "title": "May 2026",
  "payroll_frequency": "monthly",
  "pay_period_start": "2026-05-01",
  "pay_period_end": "2026-05-31",
  "pay_date": "2026-06-05",
  "notes": ""
}
```

`payroll_frequency`: `weekly` | `biweekly` | `monthly`.  
Payroll `status`: `draft` → `processing` → `completed`.

Entry `status`: `unpaid` | `paid`.

---

## 8. Workflow / HR actions (`/hrm/{resource}`)

Resources (each: list, get, create, update, delete; many have status):

| Resource | Status endpoint | Status permission |
|----------|-----------------|-------------------|
| `holidays` | — | — |
| `awards` | — | — |
| `promotions` | `PUT /:id/status` | `manage-promotions-status` |
| `resignations` | `PUT /:id/status` or `PUT /:id/status/:status` | `manage-resignation-status` |
| `terminations` | `PUT /:id/status` | `manage-termination-status` |
| `warnings` | — + `PUT /warnings/:id/response` | `manage-warning-response` |
| `complaints` | `PUT /:id/status` | `manage-complaint-status` |
| `employee-transfers` | `PUT /:id/status` | `manage-employee-transfers-status` |
| `events` | `PUT /:id/status` | `manage-event-status` |
| `announcements` | `PUT /:id/status` | `manage-announcements-status` |
| `documents` | `PUT /:id/status` | `manage-hrm-documents-status` |
| `acknowledgments` | `PUT /:id/status` | `manage-acknowledgment-status` |

**Event calendar (FullCalendar-style)**

`GET /hrm/events/event-calendar`

```json
[
  {
    "_id": "...",
    "title": "Team meet",
    "startDate": "2026-05-20T00:00:00.000Z",
    "endDate": "2026-05-20T00:00:00.000Z",
    "time": "10:00",
    "description": "",
    "type": "Meeting",
    "color": "#3b82f6"
  }
]
```

**Status body (generic)**

```json
{ "status": "approved" }
```

Use resource-specific enum values from UI (see models in `src/modules/make_modules/hrm/models/workflow.models.ts`).

**Warning response (employee)**

```json
{ "employee_response": "I acknowledge the warning." }
```

---

## 9. Lookups (dependent dropdowns)

| Method | Path | Returns |
|--------|------|---------|
| `GET` | `/hrm/users/:employeeUserId/warning-bies` | Users who can issue warning (excludes self) |
| `GET` | `/hrm/users/:warningById/warning-types` | Warning types |
| `GET` | `/hrm/event-types/:eventTypeId/approved-bies` | Approver users |
| `GET` | `/hrm/employees/:employeeId/shifts` | `employee_shift` + all `shifts` (`:employeeId` = profile id) |

---

## 10. Frontend flows (recommended order)

### A. Company admin — new employee

1. `GET /hrm/employees/eligible-users`
2. `GET /hrm/employees/generate-id` (optional)
3. `GET /hrm/employees/lookups`
4. `POST /hrm/employees`
5. `GET /hrm/payroll/set-salary/:profileId` → add allowances/deductions

### B. Staff — mobile day

1. `GET /hrm/mobile/home`
2. `GET /hrm/attendances/clock-status` or `POST /hrm/mobile/clock-in-out`
3. `GET /hrm/mobile/leaves` / `POST /hrm/mobile/leave-request`

### C. HR — payroll month

1. `PUT /hrm/setup/working-days` (once)
2. `POST /hrm/payroll` → create period
3. `POST /hrm/payroll/:id/run`
4. `GET /hrm/payroll/:id` → review entries
5. `GET /hrm/payroll/entries/:entryId/print` → render PDF
6. `PATCH /hrm/payroll/entries/:entryId/pay`

---

## 11. Types & timestamps

- All Mongo documents use **`_id`** (string in JSON responses after lean formatting).
- `createdAt` / `updatedAt` on schemas with `timestamps: true`.
- Dates: ISO strings in JSON (`2026-05-19` or full ISO datetime).
- Populated refs return nested objects (`employee_user_id: { name, email, image }`).

---

## 12. Not in API yet (integration notes)

| Feature | Note |
|---------|------|
| Employee document **upload** | Use existing `file-upload` module; then attach URL to profile/documents collection |
| Payslip PDF file | `GET .../print` returns data; frontend or `pdf.generator` builds PDF |
| Subscription gate | Laravel `PlanModuleCheck:Hrm` — not enforced in Node yet |
| Payroll → accounting journal | Not wired to Account module |

---

## Source code map

| Area | Path |
|------|------|
| Routes entry | `src/modules/make_modules/hrm/hrm.route.ts` |
| Registered in app | `src/routes/index.ts` → `/api/v1/hrm` |
| Permissions | `src/modules/make_modules/hrm/shared/hrm.permissions.ts` |
| Models | `src/modules/make_modules/hrm/models/` |

For questions or missing fields, compare with Laravel: `packages/workdo/Hrm/src/Routes/web.php` and `api.php`.
