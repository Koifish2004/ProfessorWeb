package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)


func RequireAuthHeader(c *gin.Context){
	authHeader := c.GetHeader("Authorization")
	if authHeader == ""{
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Missing auth token",
		})
		c.Abort()
		return
	}


	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer"{
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid authorization format",
		})
		c.Abort()
		return
	}

	tokenString :=tokenParts[1]

	token, err:=jwt.Parse(tokenString, func(token *jwt.Token)(interface{}, error){
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok{

			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])

		}

		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret ==""{
			return nil, fmt.Errorf("JWT_SECRET not configured")
		}

		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid{
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":"Invalid or expired token",
		})

		c.Abort()
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok{
		if email, ok := claims["sub"].(string); ok{
			c.Set("user_email", email)
		}
	}

	c.Next()

}