
## New Features (Session 2)

- [x] Upload progress bar: replace fetch with XMLHttpRequest in handleFiles, track per-file upload progress (0-100%), show progress bar UI under each uploading file
- [x] Inquiry records DB: add `inquiries` table to drizzle/schema.ts with all form fields + files JSON + createdAt
- [x] Inquiry records DB: run pnpm db:push to sync schema
- [x] Inquiry records DB: add saveInquiry() and getInquiries() helpers in server/db.ts
- [x] Inquiry records backend: modify contact.submit to save inquiry to DB after form submission
- [x] Inquiry records backend: add admin.getInquiries tRPC procedure (adminProcedure)
- [x] Inquiry records frontend: create client/src/pages/AdminInquiries.tsx with DashboardLayout showing inquiry table
- [x] Inquiry records frontend: register /admin/inquiries route in App.tsx
- [x] Update DashboardLayout menuItems to include Inquiries page
- [x] Write vitest tests for saveInquiry and getInquiries
