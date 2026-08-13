# M'Sila Insights Hub

Build a professional, enterprise-grade AI-powered Customer Complaint Analytics Dashboard for "Algérie Télécom - Direction Opérationnelle M'Sila (DOT M'SILA)".

### Design System & Theme:

- Color Palette: Algérie Télécom brand colors — Deep Navy Blue (`#002B49`), Telecom Blue (`#0066B2`), Cyan Accent (`#00A3E0`), and clean off-white background (`#F8FAFC`).

- Style: Modern, crisp typography, clean cards with soft drop shadows, and subtle borders.

### Layout & Page Structure:

1. Header & Navigation:

   - Algérie Télécom logo badge and "DOT M'SILA — Direction Opérationnelle" sub-header.

   - Global Date Range Picker, Filter by Channel (Call Center, Web Form, Written Complaint), and Region/Commune filter.

2. KPI Metric Cards (Top Section):

   - Total Complaints Logged (with % trend vs previous month).

   - Average Resolution Time (in days/hours).

   - Resolution Rate (% Resolved vs Pending).

   - Predicted At-Risk / High Priority Tickets (ML Indicator).

3. Main Analytics Tabs:

   - Tab 1: Executive Dashboard (Charts & Trends)

     - Interactive Line Chart: Monthly complaint trends over time.

     - Stacked Bar Chart: Complaint volume by type (ADSL, FTTH Fiber, Billing, Network Outage, Call Center quality).

     - Donut Chart: Complaint status distribution (Résolu, En Cours, Non Traité).

     - Geographic Bar/Heatmap: Complaints by region/commune across M'Sila.

   - Tab 2: Predictive Status & Insights (ML Engine)

     - A form to simulate/predict ticket resolution status: Select Client Type, Complaint Category, Commune, and Submission Date.

     - Displays a prediction card showing "Likely Status" (e.g., 88% probability of Resolution within 48h) powered by Random Forest / Logistic Regression models.

   - Tab 3: Customer Complaints Data Explorer

     - Filterable data table showing: Ticket ID, Client Name, Submission Channel, Date, Type, Region, Current Status, and Action buttons.

Make the UI completely responsive, clean, and styled using Tailwind CSS and Lucide React icons.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4fe54c73-a0ed-4197-b677-5cde53322fe0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
