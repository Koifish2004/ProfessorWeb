package middleware

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context){
	fmt.Println("Koifish in middleware")


	//get cookie
	tokenString, err := c.Cookie("Authorization")

	if err!=nil{
		c.AbortWithStatus(http.StatusUnauthorized)
	}


	//decode
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
	// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
	return []byte(os.Getenv("SECRET_KEY_JWT")), nil
}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
if err != nil {
	log.Fatal(err)
}

if claims, ok := token.Claims.(jwt.MapClaims); ok {

	if float64(time.Now().Unix())>claims["exp"].(float64){

		c.AbortWithStatus(http.StatusUnauthorized)

	}
	fmt.Println(claims["foo"], claims["nbf"])
} else {
	c.AbortWithStatus(http.StatusUnauthorized)
}


	c.Next()

}