package routes

import (
	"github.com/Vicente/Password-Mobile-App/backend/app/controllers"
	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(router *gin.Engine, authController *controllers.AuthController) {
	authRoutes := router.Group("/api/auth")
	{
		authRoutes.POST("/signup", authController.Signup)
	}
} 