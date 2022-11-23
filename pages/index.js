import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css';
import Banner from "../components/banner";
import Card from "../components/card";
import coffeeStoresData from "../data/coffee-stores.json";
import {fetchCoffeeStores} from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location"
import { useEffect, useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/store-context';
import { isEmpty } from '../utils';

//Função que estabelece que esses dados serão pré-renderizados no servidor;
export async function getStaticProps(context){

  const coffeeStores = await fetchCoffeeStores();

  return {
    //Isso faz com que "props" receba como valor o array de objetos "coffeeStores" que contém a lista de coffe shops que serão mostradas na Home page;
    props: {
      coffeeStores,
    },
  }
}

//Tudo desta função está sendo renderizado no lado do Cliente;
//Cada coffee store está sendo disponibilizada para a home page por meio das "props";
export default function Home(props) {

  //Constante que permite usar o Hook que usa a API GeoLocation;
  const {handleTrackLocation, locationErrorMsg, isFindingLocation} = 
    useTrackLocation();

  //const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`);

          const coffeeStores = await response.json();

          //set coffee stores
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores
            }
          });
          setCoffeeStoresError("");
        } catch (error) {
          //set error
          console.log({ error });
          setCoffeeStoresError(error.message)
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);
  
  //Evento que pega as coordenadas geográficas do usuário para encontrar coffee shops próximos a ele;
  const handleOnBannerBtnClick = () => {

    handleTrackLocation();

  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} handleOnClick={handleOnBannerBtnClick}/>

        {locationErrorMsg && <p>Something went wrong:{locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong:{coffeeStoresError}</p>}
        
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={700} height={400}/>
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.sectionWrapper}>
          {props.coffeeStores.length > 0 && (
            <>
              <h2 className={styles.heading2}>Rio Grande Coffee Stores</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"}
                      href={`/coffee-store/${coffeeStore.id}`}
                      className={styles.card}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
