package main

import (
	"net/http"
	"time"

	"github.com/Koifish2004/ProfessorWeb/grademyprofAuth/initializer"
	"github.com/Koifish2004/ProfessorWeb/grademyprofAuth/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)


func init(){
	initializer.LoadEnvVars()
}

func main(){
	r:=gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "https://kaifn8n.online"}, // Local dev + Production
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
		
	}))

	r.POST("/login",middleware.RateLimiter(5, time.Minute),middleware.VerifyFirebaseToken, middleware.GenerateJWT)

	r.GET("/verify-token", middleware.RequireAuthHeader, func(c *gin.Context) {
        email, _ := c.Get("user_email")
        c.JSON(http.StatusOK, gin.H{
            "valid": true,
            "email": email,
        })
    })

	r.Run()
}