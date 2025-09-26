package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

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
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// API routes
	app.Get("/api/professors", getProfessors)
	app.Get("/api/professors/:id", getProfessor)

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
