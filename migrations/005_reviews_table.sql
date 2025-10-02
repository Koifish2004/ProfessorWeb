-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    professor_id INTEGER NOT NULL REFERENCES professor(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    difficulty DECIMAL(2,1) NOT NULL CHECK (difficulty >= 1.0 AND difficulty <= 5.0),
    would_take_again BOOLEAN NOT NULL,
    course VARCHAR(100) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reviews ADD CONSTRAINT unique_user_professor_review 
    UNIQUE (user_email, professor_id);

-- Create index on professor_id for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_professor_id ON reviews(professor_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_user_email ON reviews(user_email); 

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews" ON reviews FOR INSERT WITH CHECK (true);