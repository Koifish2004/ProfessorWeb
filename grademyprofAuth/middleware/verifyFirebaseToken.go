package middleware

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
)


var firebaseApp *firebase.App
var firebaseAuth *auth.Client

func InitFirebase(serviceAccountPath string) error{
	var opt option.ClientOption
	
	// Check if Firebase credentials are in environment variable (for Railway)
	if credJSON := os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY"); credJSON != "" {
		opt = option.WithCredentialsJSON([]byte(credJSON))
	} else {
		// Fall back to file path (for local development)
		opt = option.WithCredentialsFile(serviceAccountPath)
	}
	
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err!= nil{
		return err
	}

	authClient, err := app.Auth(context.Background())
	if err != nil{
		return err
	}
	firebaseApp = app
	firebaseAuth = authClient
	log.Println("FAdminSDK init success")
	return nil
}


func VerifyFirebaseToken(c *gin.Context){
	var requestBody struct {
        FirebaseToken string `json:"firebase_token"`
        Email         string `json:"email"`
    }

	if err := c.ShouldBindJSON(&requestBody);
	err!= nil{

		c.JSON(400, gin.H{
			"error":"Ivalid Body req",
		})
		c.Abort()
		return
	}

	token, err :=firebaseAuth.VerifyIDToken(context.Background(), requestBody.FirebaseToken)

	if err != nil{
		log.Printf("Firebase token verification failed: %v", err)
        c.JSON(401, gin.H{"error": "Invalid Firebase token"})
        c.Abort()
        return
	}

	email, ok := token.Claims["email"].(string)
    if !ok || email == "" {
        c.JSON(401, gin.H{"error": "Email not found in token"})
        c.Abort()
        return
    }

	if email != requestBody.Email {
        c.JSON(401, gin.H{"error": "Email mismatch"})
        c.Abort()
        return
    }

	emailVerified, ok := token.Claims["email_verified"].(bool)
    if !ok || !emailVerified {
        c.JSON(401, gin.H{"error": "Email not verified"})
        c.Abort()
        return
    }

	log.Printf("firebase token verified for: %s", email)

	  c.Set("verified_email", email)
    c.Next()

}