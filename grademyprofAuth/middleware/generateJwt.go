package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type User struct{
	Email string `json:"email" binding:"required"`
}



func GenerateJWT(c *gin.Context){
	var user User
	 if err:=c.ShouldBindJSON(&user); err !=nil{
		c.JSON(http.StatusBadRequest, gin.H{"error":"Email is required"})
		return
	 }

	fmt.Println("Generating JWT Token")

	jwtSecret := os.Getenv("JWT_SECRET")

	if jwtSecret == ""{
		c.JSON(http.StatusInternalServerError, gin.H{"error":"JWT secret not configured"})
		return
	}

	token:=jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.Email,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(time.Hour*24*30).Unix(),

	})

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err!=nil{
		c.JSON(http.StatusInternalServerError, gin.H{"error":"Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token" : tokenString,
		"email" :user.Email,
	})


}