export const getFormattedResponse = (response) => {
    return {
        date: new Date(response.date),
        ...response,
    }
}

export const getFormattedDTO = (response) => {
    return {
        date: new Date(response.date),
        ...response,
    }
}