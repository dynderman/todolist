# Google Stitch UI/UX Prompt

Copy and paste the prompt below into [Google Stitch](https://stitch.withgoogle.com/):

```text
Create a modern, clean, and highly responsive single-page web application dashboard for a "To-Do List Management App" using Tailwind CSS, HTML5, and vanilla JavaScript. The visual aesthetics should adopt a clean corporate tech look inspired by modern productivity tools like Notion and Linear, utilizing slate and indigo color tones.

The interface must consist of the following structured sections:

1. TOP HEADER BAR:
- Application branding with a sleek checklist icon, the main title "TaskFlow - To-Do List Management", and a subtle subtitle "Organize and accomplish your daily tasks efficiently".
- On the far right, display an interactive pill badge indicating connection status: a green pulsing dot with the text "Supabase Connected" (bg-emerald-50 text-emerald-700 border border-emerald-200).

2. SUMMARY / KPI CARDS (Top Section, 3-Column Grid):
- Card 1 (Total Tasks): Icon with a clipboard/layers icon, label "Total Tasks", large bold metric display (e.g., "12"), and a small caption "All recorded items".
- Card 2 (Pending Tasks): Amber/orange accent icon with a clock/hourglass, label "Pending Tasks", large metric display (e.g., "5"), and a small badge "Needs attention".
- Card 3 (Completed Tasks): Emerald/green accent icon with a check-circle, label "Completed Tasks", large metric display (e.g., "7"), and a small progress ratio badge (e.g., "58% Completed").

3. MAIN SPLIT CONTENT LAYOUT (Responsive 2-Column Grid on desktop, 1-Column on mobile):

- LEFT COLUMN (Task Form & Real-time Validation):
  - A sticky card container with the title "Task Entry Form" and a dynamic subtitle ("Add a new task" or "Editing task #ID").
  - An Alert Error Box placed right above the inputs: hidden by default, styled with bg-rose-50 text-rose-700 border border-rose-200 rounded-lg p-3 text-sm font-medium flex items-center gap-2 (displays: "Judul tugas tidak boleh kosong!" when validation fails).
  - Form Fields:
    1. Task Title (`judul`): Text input with placeholder "e.g., Menyusun Laporan Proyek SKPL", character counter (0/150).
    2. Description (`deskripsi`): Textarea with 3 rows, placeholder "Rincian instruksi atau catatan tugas...".
    3. Deadline (`deadline`): Date picker input with a calendar icon.
    4. Status (`status`): Dropdown select with options "Pending" and "Completed".
  - Action Buttons:
    - Primary Button: "Simpan Tugas" (bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2).
    - Secondary Button: "Batal Edit / Reset" (hidden in create mode, visible in edit mode, bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-lg).

- RIGHT COLUMN (Task Table, Quick Actions & Filters):
  - Filter & Search Bar:
    - Search Box: Input with magnifying glass icon for real-time searching by title and description.
    - Status Filter Dropdown: Options "Semua Status", "Pending", "Completed".
  - Interactive Task Table / List:
    - Table Headers: Checkbox, Judul & Deskripsi, Deadline, Status, Aksi.
    - Row Elements:
      - Quick Toggle Checkbox: A rounded checkbox to instantly toggle task status between Pending and Completed. Checked tasks should display a strikethrough styling (`line-through text-slate-400`) on the title.
      - Badges: Pill badges for status — Amber for "Pending" (`bg-amber-50 text-amber-700 border-amber-200`), Emerald for "Completed" (`bg-emerald-50 text-emerald-700 border-emerald-200`).
      - Action Buttons: Edit button with pencil icon (text-indigo-600 hover:bg-indigo-50 p-1.5 rounded) and Delete button with trash icon (text-rose-600 hover:bg-rose-50 p-1.5 rounded).
    - Empty State: When no tasks match, show an illustration or folder icon with text "Belum ada tugas yang tersedia" and a hint to add one using the left form.

4. FEEDBACK & ACCESSIBILITY:
- Smooth micro-interactions, clean focus rings (focus:ring-2 focus:ring-indigo-500), mobile-first responsive breakpoints, and clear typography hierarchy using standard system or Inter font.
```
