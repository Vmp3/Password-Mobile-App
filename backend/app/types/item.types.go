package types

import (
	"gorm.io/gorm"
)

type Item struct {
	gorm.Model
	Nome   string `json:"nome" binding:"required"`
	Senha  string `json:"senha" binding:"required"`
	UserID uint   `json:"userId" binding:"required"`
	User   User   `json:"user" gorm:"foreignKey:UserID"`
}

type CreateItemRequest struct {
	Nome   string `json:"nome" binding:"required"`
	Senha  string `json:"senha" binding:"required"`
	UserID uint   `json:"-"`
}

type ItemResponse struct {
	ID     uint   `json:"id"`
	Nome   string `json:"nome"`
	Senha  string `json:"senha"`
	UserID uint   `json:"userId"`
}
