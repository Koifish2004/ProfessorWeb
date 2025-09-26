CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    campus VARCHAR(50) CHECK (campus IN ('pilani', 'goa', 'hyderabad')),
    university VARCHAR(255) NOT NULL,
    
    -- Fields your UI expects (calculated from reviews)
    average_rating DECIMAL(2,1) DEFAULT 0,
    review_count INT DEFAULT 0,
    average_difficulty DECIMAL(2,1) DEFAULT 0,
    would_take_again_percent INT DEFAULT 0
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    professor_id INT,
    rating DECIMAL(2,1),
    difficulty DECIMAL(2,1),
    would_take_again BOOLEAN,
    review_text TEXT,
    FOREIGN KEY (professor_id) REFERENCES professor(id)
);

-- Sample data to match your UI
INSERT INTO professor (name, department, campus, university, average_rating, review_count, average_difficulty, would_take_again_percent) VALUES
-- Pilani
('Dr. Rajesh Kumar', 'Computer Science', 'pilani', 'BITS Pilani', 4.8, 156, 3.5, 87),
('Prof. Anita Sharma', 'Electronics & Communication', 'pilani', 'BITS Pilani', 4.6, 132, 3.8, 82),
('Dr. Vikram Singh', 'Mechanical Engineering', 'pilani', 'BITS Pilani', 4.4, 98, 3.2, 79),
('Prof. Sunita Agarwal', 'Mathematics', 'pilani', 'BITS Pilani', 4.7, 124, 4.1, 85),
('Dr. Amit Verma', 'Physics', 'pilani', 'BITS Pilani', 4.5, 167, 3.6, 81),

-- Goa
('Dr. Maria D''Silva', 'Computer Science', 'goa', 'BITS Goa', 4.9, 143, 3.3, 91),
('Prof. Arjun Nair', 'Chemical Engineering', 'goa', 'BITS Goa', 4.6, 89, 3.7, 84),
('Dr. Priya Menon', 'Biotechnology', 'goa', 'BITS Goa', 4.8, 156, 3.1, 88),
('Prof. Rohit Kamat', 'Civil Engineering', 'goa', 'BITS Goa', 4.3, 76, 3.9, 75),
('Dr. Sneha Fernandes', 'Economics', 'goa', 'BITS Goa', 4.7, 134, 3.4, 86),

-- Hyderabad
('Dr. Krishna Reddy', 'Computer Science', 'hyderabad', 'BITS Hyderabad', 4.8, 178, 3.6, 89),
('Prof. Lakshmi Rao', 'Electronics & Instrumentation', 'hyderabad', 'BITS Hyderabad', 4.5, 112, 3.8, 83),
('Dr. Suresh Chandra', 'Pharmaceutical Sciences', 'hyderabad', 'BITS Hyderabad', 4.7, 145, 3.2, 87),
('Prof. Deepika Gupta', 'Management', 'hyderabad', 'BITS Hyderabad', 4.4, 93, 3.0, 78),
('Dr. Ravi Kumar', 'Chemical Engineering', 'hyderabad', 'BITS Hyderabad', 4.6, 167, 3.7, 85);