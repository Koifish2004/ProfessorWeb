package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type visitor struct{
	lastSeen time.Time
	count int	
}

var(
	visitors = make(map[string]*visitor)
	mu sync.Mutex
)

func init(){
	go cleanupVisitors()
}

func cleanupVisitors(){
	for{
		time.Sleep(3* time.Minute)
		mu.Lock()
		for ip, v:= range visitors{
			if time.Since(v.lastSeen)> 3*time.Minute{
				delete(visitors, ip)
			}
		}
		mu.Unlock()
	}
}

func RateLimiter(maxRequests int, window time.Duration) gin.HandlerFunc{

	return func(c *gin.Context){
		ip := c.ClientIP()
		mu.Lock()
		v, exists := visitors[ip]
		if !exists{
			visitors[ip] =&visitor{
				lastSeen : time.Now(),
				count: 1,
			}
			mu.Unlock()
		c.Next()
		return
		}

		if time.Since(v.lastSeen) >window{
			v.lastSeen = time.Now()
			v.count =1
			mu.Unlock()
			c.Next()
			return
		}

		v.count++
		v.lastSeen = time.Now()

		if v.count > maxRequests{
			mu.Unlock()
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":"Rate limit exceeded, try again later",
			})
			c.Abort()
			return
		}

		mu.Unlock()
		c.Next()

		
	}

}

