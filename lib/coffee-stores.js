import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  //Faz uma requisição de busca na APIdo UNSPLASH para buscar fotos de cafeterias randômicas para preencher os cards;
  const photos = await unsplash.search.getPhotos({
    query: 'coffee shop',
    page: 1,
    perPage: 12,
  });
  const unsplashResults = photos.response.results

  return unsplashResults.map((result) => result.urls["small"]);
}

export const fetchCoffeeStores = async () => {

  const photos = await getListOfCoffeeStorePhotos();

  //Autorizações de requisição para a API do Foursquare;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    }
  };

  //Requisição das coffee shops para a API do Foursquare;
  const response = await fetch(getUrlForCoffeeStores("-32.041070742416906%2C-52.08706121685303", "caf%C3%A9", 12), options);
  const data = await response.json();
  return data.results.map((result, idx) => {
    return {
      id: result.fsq_id,
      address: result.location.address ?? "",
      name: result.name,
      locality: result.location.locality,
      imgUrl: photos.length > 0 ? photos[idx] : null,
    };
  });
};