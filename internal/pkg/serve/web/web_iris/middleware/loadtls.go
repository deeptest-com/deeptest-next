package middleware

import (
	"github.com/iris-contrib/middleware/secure"
	"github.com/kataras/iris/v12"
)

// LoadTls
func LoadTls() iris.Handler {
	middleware := secure.New(secure.Options{
		SSLRedirect: true,
		SSLHost:     "0.0.0.0:443",
	})
	return middleware.Handler
}
