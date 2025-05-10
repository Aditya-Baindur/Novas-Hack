# Novas - Customer Purchase Predictor

A Next.js application that predicts customer purchase decisions based on customer profile vectors and market events.

## Features

- Input customer profile data through 4 sliders:
  - Brand Loyalty
  - Risk Tolerance
  - Innovation Adoption
  - Price Sensitivity
- Add market events that can affect purchase decisions
- View purchase decision predictions (BOUGHT or NOT BOUGHT)
- Explanation of reasoning behind decisions

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/novas.git
cd novas
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js application files
  - `components/` - React components
  - `lib/` - Utility functions and mock data
  - `dashboard/` - Dashboard pages

## How It Works

1. Set customer profile parameters using sliders
2. Select market events that may impact customer behavior
3. The system calculates the likelihood of purchase
4. View the resulting decision with confidence level and reasoning

## Future Enhancements

- Historical data tracking
- User accounts and saved profiles
- Real-time data integration
- Advanced analytics and reporting
- ML model training on real customer data