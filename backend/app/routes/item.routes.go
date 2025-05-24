package routes

import (
	"github.com/Vicente/Password-Mobile-App/backend/app/controllers"
	"github.com/Vicente/Password-Mobile-App/backend/app/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupItemRoutes(app *fiber.App, itemController *controllers.ItemController) {
	itemRoutes := app.Group("/api")

	itemRoutes.Use(middleware.AuthMiddleware())

	itemRoutes.Post("/item", itemController.CreateItem)
	itemRoutes.Get("/items", itemController.GetItemsByUser)
	itemRoutes.Delete("/item/:id", itemController.DeleteItem)
}
