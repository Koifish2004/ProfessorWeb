package middleware

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(c *fiber.Ctx) error {
    authHeader := c.Get("Authorization")
    if authHeader == "" {
        return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
            "error": "Missing authorization token",
        })
    }

    req, err := http.NewRequest("GET", "http://localhost:8080/verify-token", nil)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Failed to verify token",
        })
    }

    req.Header.Set("Authorization", authHeader)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "Auth service unavailable",
        })
    }
    defer resp.Body.Close()

    if resp.StatusCode == http.StatusUnauthorized {
        body, _ := io.ReadAll(resp.Body)
        var authError map[string]interface{}
        json.Unmarshal(body, &authError)
        
        return c.Status(fiber.StatusUnauthorized).JSON(authError)
    }

    if resp.StatusCode == http.StatusOK {
        body, _ := io.ReadAll(resp.Body)
        var authResponse map[string]interface{}
        json.Unmarshal(body, &authResponse)
        
        if email, ok := authResponse["email"].(string); ok {
            c.Locals("user_email", email)
        }
        
        return c.Next()
    }

    return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
        "error": "Failed to verify token",
    })
}