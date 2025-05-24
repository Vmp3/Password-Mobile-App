package services

import (
	"errors"
	"os"
	"time"

	"github.com/Vicente/Password-Mobile-App/backend/app/dal"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

const (
	jwtSecret = os.Getenv("JWT_SECRET") 
	jwtExpiry = 24 * time.Hour
)

type AuthService struct {
	AuthDAL *dal.AuthDAL
}

func NewAuthService(authDAL *dal.AuthDAL) *AuthService {
	return &AuthService{
		AuthDAL: authDAL,
	}
}

func (s *AuthService) Signup(req *types.SignupRequest) (*types.AuthResponse, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Senha), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("erro ao processar senha")
	}

	user := &types.User{
		Nome:           req.Nome,
		DataNascimento: req.DataNascimento,
		Email:          req.Email,
		SenhaHash:      string(hashedPassword),
	}

	if err := s.AuthDAL.CreateUser(user); err != nil {
		return nil, err
	}

	token, err := s.generateJWT(user)
	if err != nil {
		return nil, errors.New("erro ao gerar token de autenticação")
	}

	user.Senha = ""

	return &types.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) generateJWT(user *types.User) (string, error) {
	claims := jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(jwtExpiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(jwtSecret))
} 