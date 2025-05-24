package controllers

import (
	"strconv"

	"github.com/Vicente/Password-Mobile-App/backend/app/services"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/gofiber/fiber/v2"
)

type ItemController struct {
	ItemService *services.ItemService
}

func NewItemController(itemService *services.ItemService) *ItemController {
	return &ItemController{
		ItemService: itemService,
	}
}

func (c *ItemController) CreateItem(ctx *fiber.Ctx) error {
	var req types.CreateItemRequest

	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Dados inválidos: " + err.Error(),
		})
	}

	userID, ok := ctx.Locals("userID").(uint)
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Usuário não autenticado",
		})
	}

	req.UserID = userID

	response, err := c.ItemService.CreateItem(&req)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(response)
}

func (c *ItemController) GetItemsByUser(ctx *fiber.Ctx) error {
	userID, ok := ctx.Locals("userID").(uint)
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Usuário não autenticado",
		})
	}

	items, err := c.ItemService.GetItemsByUser(userID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if len(items) == 0 {
		return ctx.SendStatus(fiber.StatusNoContent)
	}

	return ctx.Status(fiber.StatusOK).JSON(items)
}

func (c *ItemController) DeleteItem(ctx *fiber.Ctx) error {
	itemIDParam := ctx.Params("id")
	if itemIDParam == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do item é obrigatório",
		})
	}

	itemID, err := strconv.ParseUint(itemIDParam, 10, 32)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "ID do item inválido",
		})
	}

	userID, ok := ctx.Locals("userID").(uint)
	if !ok {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Usuário não autenticado",
		})
	}

	err = c.ItemService.DeleteItem(uint(itemID), userID)
	if err != nil {
		if err.Error() == "item não encontrado ou você não tem acesso a ele" {
			return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"error": "Você não tem acesso a este item",
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}
