package dal

import (
	"errors"

	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"gorm.io/gorm"
)

type ItemDAL struct {
	DB *gorm.DB
}

func NewItemDAL(db *gorm.DB) *ItemDAL {
	return &ItemDAL{
		DB: db,
	}
}

func (d *ItemDAL) CreateItem(item *types.Item) error {
	var existingItem types.Item
	result := d.DB.Where("nome = ? AND user_id = ?", item.Nome, item.UserID).First(&existingItem)
	if result.Error == nil {
		return errors.New("já existe um item com este nome")
	} else if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return result.Error
	}

	return d.DB.Create(item).Error
}

func (d *ItemDAL) GetItemsByUserID(userID uint) ([]types.Item, error) {
	var items []types.Item
	result := d.DB.Where("user_id = ?", userID).Find(&items)
	if result.Error != nil {
		return nil, result.Error
	}
	return items, nil
}

func (d *ItemDAL) GetItemByID(id uint, userID uint) (*types.Item, error) {
	var item types.Item
	result := d.DB.Where("id = ? AND user_id = ?", id, userID).First(&item)
	if result.Error != nil {
		return nil, result.Error
	}
	return &item, nil
}

func (d *ItemDAL) DeleteItem(id uint, userID uint) error {
	var item types.Item
	result := d.DB.Where("id = ? AND user_id = ?", id, userID).First(&item)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return errors.New("item não encontrado ou você não tem acesso a ele")
		}
		return result.Error
	}

	return d.DB.Delete(&item).Error
}
