package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/Koifish2004/ProfessorWeb/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)


type Professor struct {
	ID                    int     `json:"id"`
	Name                  string  `json:"name"`
	Department            string  `json:"department"`
	Campus                string  `json:"campus"`
	University            string  `json:"university"`
	AverageRating         float64 `json:"average_rating"`
	ReviewCount           int     `json:"review_count"`
	AverageDifficulty     float64 `json:"average_difficulty"`
	WouldTakeAgainPercent int     `json:"would_take_again_percent"`
}

type Review struct {
	ID             int     `json:"id"`
	ProfessorID    int     `json:"professor_id"`
	UserEmail      string  `json:"user_email"`
	StudentName    string  `json:"student_name"`
	Rating         float64 `json:"rating"`
	Difficulty     float64 `json:"difficulty"`
	WouldTakeAgain bool    `json:"would_take_again"`
	Course         string  `json:"course"`
	Comment        string  `json:"comment"`
	CreatedAt      string  `json:"created_at"`
}

type ReviewInput struct {
	UserEmail    string  `json:"user_email"`
	StudentName    string  `json:"student_name"`
	Rating         float64 `json:"rating"`
	Difficulty     float64 `json:"difficulty"`
	WouldTakeAgain bool    `json:"would_take_again"`
	Course         string  `json:"course"`
	Comment        string  `json:"comment"`
}

// SupabaseClient holds the configuration for Supabase API calls
type SupabaseClient struct {
	URL    string
	APIKey string
}

var supabase *SupabaseClient

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize Supabase client
	supabase = &SupabaseClient{
		URL:    os.Getenv("SUPABASE_URL"),
		APIKey: os.Getenv("SUPABASE_ANON_KEY"),
	}

	if supabase.URL == "" || supabase.APIKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file")
	}

	log.Printf("✅ Connected to Supabase: %s", supabase.URL)

	app := fiber.New()

	// CORS for your React app
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173", // Your Vite dev server
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
	}))

	// API routes
	app.Get("/api/professors", getProfessors)
	app.Get("/api/professors/:id", getProfessor)
	app.Get("/api/professors/:id/reviews", getReviews)
	app.Post("/api/professors/:id/reviews", middleware.AuthMiddleware, createReview)
	app.Patch("/api/professors/:id/reviews/:reviewId", middleware.AuthMiddleware, updateReview)
	app.Get("/api/professors/:id/user-review",middleware.AuthMiddleware, checkExistingReview)

	// Your existing routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "Hello World"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

func getProfessors(c *fiber.Ctx) error {
	campus := c.Query("campus", "pilani") // Default to pilani

	// Make request to Supabase REST API
	url := fmt.Sprintf("%s/rest/v1/professor?campus=eq.%s&order=average_rating.desc", supabase.URL, campus)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create request"})
	}

	req.Header.Set("apikey", supabase.APIKey)
	req.Header.Set("Authorization", "Bearer "+supabase.APIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Supabase API error: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch professors"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to read response"})
	}

	if resp.StatusCode != 200 {
		log.Printf("Supabase API returned status %d: %s", resp.StatusCode, string(body))
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch professors"})
	}

	var professors []Professor
	if err := json.Unmarshal(body, &professors); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to parse response"})
	}

	return c.JSON(professors)
}


func checkExistingReview(c *fiber.Ctx) error {
	professorID := c.Params("id")
	userEmail := c.Query("user_email")

	if userEmail == "" {
		return c.Status(400).JSON(fiber.Map{"error":"User email is required"})
	}

	url :=fmt.Sprintf("%s/rest/v1/reviews?professor_id=eq.%s&user_email=eq.%s", supabase.URL, professorID, userEmail)

	req, _ :=http.NewRequest("GET", url, nil)
	req.Header.Add("apikey", supabase.APIKey)
	req.Header.Add("Authorization", "Bearer "+supabase.APIKey)

	client :=&http.Client{}
	resp, err:= client.Do(req)
	if err!=nil{
		return c.Status(500).JSON(fiber.Map{"error": "Failed to check exisiting review"})

	}

	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var existingReviews []Review 
	json.Unmarshal(body, &existingReviews)

	hasReviewed := len(existingReviews) > 0
	var existingReview *Review = nil
	if hasReviewed {
		existingReview = &existingReviews[0]
	}

	return c.JSON(fiber.Map{
		"hasReviewed": hasReviewed,
		"existingReview": existingReview,
	})
}

func getProfessor(c *fiber.Ctx) error {
	id := c.Params("id")

	// Make request to Supabase REST API
	url := fmt.Sprintf("%s/rest/v1/professor?id=eq.%s", supabase.URL, id)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create request"})
	}

	req.Header.Set("apikey", supabase.APIKey)
	req.Header.Set("Authorization", "Bearer "+supabase.APIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Supabase API error: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch professor"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to read response"})
	}

	if resp.StatusCode != 200 {
		log.Printf("Supabase API returned status %d: %s", resp.StatusCode, string(body))
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch professor"})
	}

	var professors []Professor
	if err := json.Unmarshal(body, &professors); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to parse response"})
	}

	if len(professors) == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Professor not found"})
	}

	return c.JSON(professors[0])
}

func getReviews(c *fiber.Ctx) error {
	professorID := c.Params("id")

	// Make request to Supabase REST API
	url := fmt.Sprintf("%s/rest/v1/reviews?professor_id=eq.%s&order=created_at.desc", supabase.URL, professorID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create request"})
	}

	req.Header.Set("apikey", supabase.APIKey)
	req.Header.Set("Authorization", "Bearer "+supabase.APIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Supabase API error: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch reviews"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to read response"})
	}

	if resp.StatusCode != 200 {
		log.Printf("Supabase API returned status %d: %s", resp.StatusCode, string(body))
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch reviews"})
	}

	var reviews []Review
	if err := json.Unmarshal(body, &reviews); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to parse response"})
	}

	return c.JSON(reviews)
}

func createReview(c *fiber.Ctx) error {
	professorID := c.Params("id")

	var reviewInput ReviewInput
	if err := c.BodyParser(&reviewInput); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Create the review data with professor_id
	reviewData := map[string]interface{}{
		"professor_id":     professorID,
		"user_email": 		reviewInput.UserEmail,
		"student_name":     reviewInput.StudentName,
		"rating":           reviewInput.Rating,
		"difficulty":       reviewInput.Difficulty,
		"would_take_again": reviewInput.WouldTakeAgain,
		"course":           reviewInput.Course,
		"comment":          reviewInput.Comment,
	}

	// Convert to JSON for Supabase
	jsonData, err := json.Marshal(reviewData)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to process review data"})
	}

	// Make request to Supabase REST API
	url := fmt.Sprintf("%s/rest/v1/reviews", supabase.URL)

	req, err := http.NewRequest("POST", url, strings.NewReader(string(jsonData)))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create request"})
	}

	req.Header.Set("apikey", supabase.APIKey)
	req.Header.Set("Authorization", "Bearer "+supabase.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Supabase API error: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create review"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to read response"})
	}

	if resp.StatusCode != 201 {
		log.Printf("Supabase API returned status %d: %s", resp.StatusCode, string(body))
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create review"})
	}

	var createdReview []Review
	if err := json.Unmarshal(body, &createdReview); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to parse response"})
	}

	if len(createdReview) == 0 {
		return c.Status(500).JSON(fiber.Map{"error": "No review returned"})
	}

	// Update professor statistics after creating review
	go updateProfessorStats(professorID)

	return c.JSON(createdReview[0])
}

func updateReview(c *fiber.Ctx) error {
	professorID := c.Params("id")
	reviewID := c.Params("reviewId")

	var reviewInput ReviewInput
	if err := c.BodyParser(&reviewInput); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	log.Printf("🔍 Update Review - Professor: %s, ReviewID: %s, UserEmail: %s", professorID, reviewID, reviewInput.UserEmail)

	// Create the review data for update
	reviewData := map[string]interface{}{
		"student_name":     reviewInput.StudentName,
		"rating":           reviewInput.Rating,
		"difficulty":       reviewInput.Difficulty,
		"would_take_again": reviewInput.WouldTakeAgain,
		"course":           reviewInput.Course,
		"comment":          reviewInput.Comment,
	}

	// Convert to JSON for Supabase
	jsonData, err := json.Marshal(reviewData)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to process review data"})
	}

	// Make PATCH request to Supabase to update the review
	url := fmt.Sprintf("%s/rest/v1/reviews?id=eq.%s", supabase.URL, reviewID)

	log.Printf("🌐 Supabase PATCH URL: %s", url)

	req, err := http.NewRequest("PATCH", url, strings.NewReader(string(jsonData)))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create request"})
	}

	req.Header.Set("apikey", supabase.APIKey)
	req.Header.Set("Authorization", "Bearer "+supabase.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Supabase API error: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update review"})
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to read response"})
	}

	log.Printf("📡 Supabase Response Status: %d, Body: %s", resp.StatusCode, string(body))

	if resp.StatusCode != 200 {
		log.Printf("❌ Supabase API returned status %d: %s", resp.StatusCode, string(body))
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update review"})
	}

	var updatedReview []Review
	if err := json.Unmarshal(body, &updatedReview); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to parse response"})
	}

	log.Printf("📝 Supabase returned %d reviews", len(updatedReview))

	if len(updatedReview) == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Review not found"})
	}

	// Update professor statistics after updating review
	go updateProfessorStats(professorID)

	return c.JSON(updatedReview[0])
}

func updateProfessorStats(professorID string) {
	// Get all reviews for this professor
	url := fmt.Sprintf("%s/rest/v1/reviews?professor_id=eq.%s", supabase.URL, professorID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Failed to create request for stats update: %v", err)
		return
	}

	req.Header.Set("apikey", supabase.APIKey)
	req.Header.Set("Authorization", "Bearer "+supabase.APIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Failed to fetch reviews for stats: %v", err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Failed to read reviews response: %v", err)
		return
	}

	if resp.StatusCode != 200 {
		log.Printf("Failed to fetch reviews for stats, status %d: %s", resp.StatusCode, string(body))
		return
	}

	var reviews []Review
	if err := json.Unmarshal(body, &reviews); err != nil {
		log.Printf("Failed to parse reviews for stats: %v", err)
		return
	}

	if len(reviews) == 0 {
		return
	}

	// Calculate new statistics
	var totalRating, totalDifficulty float64
	var wouldTakeAgainCount int

	for _, review := range reviews {
		totalRating += review.Rating
		totalDifficulty += review.Difficulty
		if review.WouldTakeAgain {
			wouldTakeAgainCount++
		}
	}

	reviewCount := len(reviews)
	averageRating := totalRating / float64(reviewCount)
	averageDifficulty := totalDifficulty / float64(reviewCount)
	wouldTakeAgainPercent := int((float64(wouldTakeAgainCount) / float64(reviewCount)) * 100)

	// Update professor with new stats
	updateData := map[string]interface{}{
		"average_rating":           averageRating,
		"review_count":             reviewCount,
		"average_difficulty":       averageDifficulty,
		"would_take_again_percent": wouldTakeAgainPercent,
	}

	jsonData, err := json.Marshal(updateData)
	if err != nil {
		log.Printf("Failed to marshal update data: %v", err)
		return
	}

	updateURL := fmt.Sprintf("%s/rest/v1/professor?id=eq.%s", supabase.URL, professorID)
	updateReq, err := http.NewRequest("PATCH", updateURL, strings.NewReader(string(jsonData)))
	if err != nil {
		log.Printf("Failed to create update request: %v", err)
		return
	}

	updateReq.Header.Set("apikey", supabase.APIKey)
	updateReq.Header.Set("Authorization", "Bearer "+supabase.APIKey)
	updateReq.Header.Set("Content-Type", "application/json")

	updateResp, err := client.Do(updateReq)
	if err != nil {
		log.Printf("Failed to update professor stats: %v", err)
		return
	}
	defer updateResp.Body.Close()

	if updateResp.StatusCode != 204 {
		updateBody, _ := io.ReadAll(updateResp.Body)
		log.Printf("Failed to update professor stats, status %d: %s", updateResp.StatusCode, string(updateBody))
		return
	}

	log.Printf("✅ Updated professor %s stats: avg_rating=%.2f, reviews=%d", professorID, averageRating, reviewCount)
}
