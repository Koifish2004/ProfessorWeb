-- Simple indexes for performance
CREATE INDEX idx_professor_campus ON professor(campus);
CREATE INDEX idx_professor_rating ON professor(average_rating DESC);
CREATE INDEX idx_reviews_professor_id ON reviews(professor_id);
