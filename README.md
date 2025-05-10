# Customer Cluster Analysis Platform

## Overview
A sophisticated decision-making platform that matches potential customers to existing customer clusters based on key behavioral vectors. The system analyzes loyalty level, risk tolerance, innovation openness, and price sensitivity to predict purchasing decisions and simulate potential outcomes based on various events.

## Core Features

### Vector Analysis System
- 4-dimensional vector matching (loyalty, risk tolerance, innovation, price sensitivity)
- K-nearest neighbors clustering algorithm
- Confidence-based decision prediction
- Weekly cluster recalculation

### Simulation Capabilities
- Real-time customer vector input via interactive sliders
- Event application with customizable parameters
- Decision workflow visualization
- Before/after comparison of vector changes

### Multi-simulation Support
- Batch processing of multiple potential customers
- Comparative analysis of outcomes
- PDF export of decision workflows
- Historical simulation archive

### Role-based Access
- Admin dashboard with full data visibility
- User-restricted views with personal simulation history
- Toggleable authentication system

## Technical Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **UI Components**: Shadcn UI with Tailwind CSS
- **State Management**: React Context API + Zustand
- **Data Fetching**: SWR

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase PostgreSQL with pgvector extension
- **Authentication**: Supabase Auth (optional)
- **Scheduled Jobs**: Vercel Cron Jobs

### Deployment
- **Hosting**: Vercel
- **Database**: Supabase
- **Update Frequency**: Bi-weekly deployments
- **Backup Strategy**: Monthly backups

## Database Schema

### Vector Database
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  loyalty_score FLOAT NOT NULL,
  risk_tolerance FLOAT NOT NULL,
  innovation_openness FLOAT NOT NULL,
  price_sensitivity FLOAT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Cluster Storage
```sql
CREATE TABLE clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  centroid FLOAT[] NOT NULL,
  companies UUID[] NOT NULL,
  decision TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Simulation History
```sql
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  customer_name TEXT NOT NULL,
  vector FLOAT[] NOT NULL,
  events JSONB[] DEFAULT '{}',
  result JSONB NOT NULL,
  decision_workflow JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Development Environment
1. Clone the repository
   ```
   git clone https://github.com/your-org/customer-cluster-analysis.git
   cd customer-cluster-analysis
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn
   ```

3. Configure environment variables
   ```
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. Import initial dataset
   ```
   # Use Supabase dashboard to import the CSV dataset into the companies table
   ```

5. Run development server
   ```
   npm run dev
   # or
   yarn dev
   ```

### Deployment
1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy main branch
4. Set up Vercel Cron Jobs for cluster updates (weekly)

## Application Structure

```
/app
  /api
    /simulation
    /events
    /archive
    /batch-simulation
    /export-pdf
  /(routes)
    /page.tsx         # Landing page
    /simulation/page.tsx
    /batch/page.tsx
    /insights/page.tsx
    /admin/page.tsx
/components
  /simulation
    VectorInputs.tsx
    EventSelector.tsx
    DecisionDisplay.tsx
    WorkflowVisualization.tsx
  /ui                 # Shadcn UI components
/lib
  /clustering.ts      # Vector processing algorithms
  /events.ts          # Event definitions and processing
  /export.ts          # PDF generation
  /types.ts           # TypeScript definitions
/hooks
  useSimulation.ts
  useEvents.ts
  useAuth.ts
```

## Development Workflow

### Adding New Events
1. Modify `/lib/events.ts` to add a new event definition
2. Define impact values for each vector dimension
3. Add UI representation in `EventSelector.tsx`

### Modifying Vector Dimensions
*(Developer-only, requires code changes)*
1. Update database schema
2. Modify TypeScript types in `/lib/types.ts`
3. Update UI components for vector input
4. Adjust clustering algorithm

### Running Cluster Updates
Clusters are automatically updated weekly via Vercel Cron Jobs. Manual updates can be triggered from the admin dashboard.

## Future Roadmap

### V2 Features
- Batch simulation processing
- Decision workflow visualization
- PDF export functionality
- Enhanced admin dashboard

### V3 Features
- UI customization options
- Advanced reporting tools
- Vector dimensionality extensions
- External integration options

## Contributing
Follow the established code structure and patterns. Run tests before submitting pull requests.

## License
Proprietary - All rights reserved