import api from "../../utils/api";

export const createItem = (data) => {
    return api.post('/item', data).then((response) => response.data);
};

export const getItems = () => {
    return api.get('/items').then((response) => response.data);
};

export const deleteItem = (id) => {
    return api.delete(`/item/${id}`);
}; 