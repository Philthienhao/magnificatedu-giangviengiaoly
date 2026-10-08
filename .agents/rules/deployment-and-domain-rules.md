# Deployment, Domain & Gradebook Rules for MagnificatEdu

## 1. Domain Invariants
* The official production domain for this repository (`giangviengiaoly`) is ONLY:
  `https://magnificatedu.vercel.app`
* DO NOT attempt to bind or use `magnificat.vercel.app`.
* If domain mapping breaks, run:
  `npx vercel alias set magnificatedu-giangviengiaoly.vercel.app magnificatedu.vercel.app`

## 2. Cache-Busting Standards
* Whenever modifying `app_v2.js`, `app.js`, or `styles.css`, ALWAYS update the cache-buster query parameter in `index.html` (e.g., `app_v2.js?v=YYYYMMDD_vXXX`).
* Update the visual version badge in `index.html` (e.g., `Giáo Lý Số v2026.10.08`) so users can immediately confirm fresh deployments.

## 3. Gradebook Calculations & Consistency
* The full-year average score MUST strictly equal:
  $$\text{ĐTB Cả Năm} = \frac{\text{HK1} + \text{HK2}}{2}$$
* Any change to grade calculation in JS must be mirrored in:
  1. Gradebook View (`app_v2.js` / `app.js`)
  2. Grade Edit Mode (`updateStudentGradeRow`)
  3. Excel Export logic (`exportGradesToExcel`)
  4. Segmented Control UI buttons (`[ 📘 Học Kỳ I ]`, `[ 📙 Học Kỳ II ]`, `[ 🌟 ĐTB CẢ NĂM = (HK1 + HK2) / 2 ]`)

## 4. Automatic README Incident Logging
* Whenever ANY bug, deployment failure, UI error, domain issue, or calculation bug is resolved:
  1. Automatically append the new incident entry into `README.md` under Section 3 ("Nhật Ký Sự Cố & Hướng Dẫn Khắc Phục").
  2. Include Title, Root Cause, Fix Action, and Prevention Guideline.
  3. Commit and push the updated `README.md` to GitHub alongside the fix code.
