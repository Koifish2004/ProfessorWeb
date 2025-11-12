package initializer

import (
	"log"
	"os"

	"github.com/Koifish2004/ProfessorWeb/grademyprofAuth/middleware"
	"github.com/joho/godotenv"
)

func LoadEnvVars(){
	err := godotenv.Load()
  if err != nil {
    log.Fatal("Error loading .env file")
  }

  serviceAccountPath := os.Getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if serviceAccountPath == "" {
        log.Fatal("FIREBASE_SERVICE_ACCOUNT_PATH must be set in .env file")
    }

    if err := middleware.InitFirebase(serviceAccountPath); err != nil {
        log.Fatalf("Failed to initialize Firebase: %v", err)
    }

	
}