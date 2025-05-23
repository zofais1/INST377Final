# Hyrule Compendium Explorer

## Project Description
The Hyrule Compendium Explorer is an interactive web application that allows users to explore the vast world of Hyrule through a comprehensive database of items, creatures, and equipment from The Legend of Zelda: Breath of the Wild. The application provides an intuitive interface for browsing, searching, and filtering compendium entries, along with visual statistics and featured items.

## Target Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Developer Manual

### Installation
1. Clone the repository:
```bash
git clone [repository-url]
cd FinalProject
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here
```

### Running the Application
1. Start the development server:
```bash
npm start
```

2. Access the application at `http://localhost:3000`

### API Endpoints

#### GET /api/compendium
Retrieves all compendium entries.
- Response: JSON array of compendium items
- Example: `GET http://localhost:3000/api/compendium`

#### GET /api/compendium/:id
Retrieves a specific compendium entry by ID.
- Parameters: `id` (compendium entry ID)
- Response: JSON object containing the compendium entry
- Example: `GET http://localhost:3000/api/compendium/1`
