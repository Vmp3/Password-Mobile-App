package types

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Nome           string    `json:"nome" binding:"required"`
	DataNascimento time.Time `json:"dataNascimento" binding:"required"`
	Email          string    `json:"email" binding:"required,email" gorm:"unique"`
	Senha          string    `json:"senha" binding:"required" gorm:"-"`
	SenhaHash      string    `json:"-"`
}

type SignupRequest struct {
	Nome           string    `json:"nome" binding:"required"`
	DataNascimento time.Time `json:"dataNascimento" binding:"required"`
	Email          string    `json:"email" binding:"required,email"`
	Senha          string    `json:"senha" binding:"required,min=6"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
} 