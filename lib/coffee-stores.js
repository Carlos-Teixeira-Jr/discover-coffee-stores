const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
}


export const fetchCoffeStores = async () => {
  //Autorizações de requisição para a API do Foursquare;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    }
  };

  //Requisição das coffee shops para a API do Foursquare;
  const response = await fetch(getUrlForCoffeeStores("-32.041070742416906%2C-52.08706121685303", "coffee", 6), options);
  const data = await response.json();
  return data.results;
  //.catch(err => console.error(err));
}