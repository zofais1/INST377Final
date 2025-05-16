const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Please check your .env file.');
    process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

// Hyrule Compendium API endpoints
app.get('/api/compendium', async (req, res) => {
    const { data: cachedData } = await supabase
        .from('compendium_cache')
        .select('*')
        .single();

    if (cachedData) {
        return res.json(cachedData);
    }

    const response = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/all');
    const apiData = await response.json();

    const cacheData = {
        id: 1,
        data: apiData.data,
        last_updated: new Date().toISOString()
    };
    
    await supabase
        .from('compendium_cache')
        .upsert(cacheData);
    
    res.json(cacheData);
});

app.get('/api/compendium/:id', async (req, res) => {
    const response = await fetch(`https://botw-compendium.herokuapp.com/api/v3/compendium/entry/${req.params.id}`);
    const responseData = await response.json();
    const data = responseData.data;

    const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .eq('entry_id', req.params.id)
        .order('created_at', { ascending: false });

    const { data: rating } = await supabase
        .from('ratings')
        .select('avg(rating)')
        .eq('entry_id', req.params.id)
        .single();

    res.json({
        ...data,
        comments: comments || [],
        averageRating: rating?.avg || 0
    });
});

// User favorites endpoints
app.post('/api/favorites', async (req, res) => {
    const { user_id, entry_id } = req.body;
    const { data } = await supabase
        .from('favorites')
        .insert([{ user_id, entry_id }]);
    res.json(data);
});

app.get('/api/favorites/:user_id', async (req, res) => {
    const { data } = await supabase
        .from('favorites')
        .select('entry_id')
        .eq('user_id', req.params.user_id);
    res.json(data);
});

// Comments endpoints
app.post('/api/comments', async (req, res) => {
    const { user_id, entry_id, comment } = req.body;
    const { data } = await supabase
        .from('comments')
        .insert([{ user_id, entry_id, comment }]);
    res.json(data);
});

// Ratings endpoints
app.post('/api/ratings', async (req, res) => {
    const { user_id, entry_id, rating } = req.body;
    const { data } = await supabase
        .from('ratings')
        .upsert([{ user_id, entry_id, rating }]);
    res.json(data);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API available at http://localhost:${port}/api/compendium`);
}); 