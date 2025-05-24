package services

import (
	"errors"
	"strings"

	"github.com/Vicente/Password-Mobile-App/backend/app/dal"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
)

type ItemService struct {
	ItemDAL *dal.ItemDAL
}

func NewItemService(itemDAL *dal.ItemDAL) *ItemService {
	return &ItemService{
		ItemDAL: itemDAL,
	}
}

func (s *ItemService) CreateItem(req *types.CreateItemRequest) (*types.ItemResponse, error) {
	nome := strings.TrimSpace(req.Nome)
	if nome == "" {
		return nil, errors.New("nome é obrigatório")
	}

	senha := strings.TrimSpace(req.Senha)
	if senha == "" {
		return nil, errors.New("senha é obrigatória")
	}

	if req.UserID == 0 {
		return nil, errors.New("usuário é obrigatório")
	}

	item := &types.Item{
		Nome:   nome,
		Senha:  senha,
		UserID: req.UserID,
	}

	if err := s.ItemDAL.CreateItem(item); err != nil {
		return nil, err
	}

	return &types.ItemResponse{
		ID:     item.ID,
		Nome:   item.Nome,
		Senha:  item.Senha,
		UserID: item.UserID,
	}, nil
}

func (s *ItemService) GetItemsByUser(userID uint) ([]types.ItemResponse, error) {
	items, err := s.ItemDAL.GetItemsByUserID(userID)
	if err != nil {
		return nil, err
	}

	var response []types.ItemResponse
	for _, item := range items {
		response = append(response, types.ItemResponse{
			ID:     item.ID,
			Nome:   item.Nome,
			Senha:  item.Senha,
			UserID: item.UserID,
		})
	}

	return response, nil
}

func (s *ItemService) DeleteItem(itemID uint, userID uint) error {
	if itemID == 0 {
		return errors.New("ID do item é obrigatório")
	}

	if userID == 0 {
		return errors.New("usuário é obrigatório")
	}

	return s.ItemDAL.DeleteItem(itemID, userID)
}
