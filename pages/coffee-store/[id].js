import {useRouter} from "next/router";
import Link from "next/link";
import coffeeStoreData from "../../data/coffee-stores.json";
import Head from "next/head";
import styles from "../../styles/coffee-store.module.css";
import Image from "next/image";
import cls from "classnames";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils/";

//Aqui pegamos o id de cada coffe store e atribuímos eles ao id da página dinâmica;
export async function getStaticProps(staticProps){
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreId = coffeeStores.find(coffeeStore => {
    return coffeeStore.id.toString() === params.id;
  })
  return {
    props: {
      coffeeStore: findCoffeeStoreId ? findCoffeeStoreId : {}
    }
  }
}

//Aqui informamos quais rotas precisam ser pré-renderizadas no lado do Servidor;
export async function getStaticPaths() {

  const coffeeStores = await fetchCoffeeStores();

  //Variável que recebe o ID de cada cafeteria no DB e atribui ele ao PATHS para não ser necessário digitar os parametros de cada path individualmente;
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    //Se FALLBACK for FALSE apenas as rotas especificadas no PATHS serão renderizadas e o restante retornará 404 not found;
    paths,
    fallback: true,
  };
}

//Para que estapágina e rota sejam devidamente criadas é precisa que tenha a síntaxe de um COMPONENTE REACT e que seja exportada por default;
const CoffeeStore = (initialProps) => {

  //O Router capta informações da rota em um objeto/ Aqui será usado para capturar o id da página dinâmica // Só funciona no lado do Client;
  const router = useRouter();

  //Estabelece uma mensagem caso a página seja criada em FALLBACK TRUE...
  if(router.isFallback){
    return <div>Loading...</div>;
  }

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore)

  const {
    state: {
      coffeeStores
    }
  } = useContext(StoreContext);

  useEffect(() => {
    if(isEmpty(initialProps.coffeeStore)){
      if(coffeeStores.length > 0) {
        const findCoffeStoreById = coffeeStores.find(
          (coffeeStore) => {
            return coffeeStore.id.toString() === id;//dynamic id
          }
        );
        setCoffeeStore(findCoffeStoreById);
      }
    }
  }, [id]);

  //Variáveis em formato destructuring, precisam ser declaradas após a checagem de FALLBACK pois antes disso a página pode ainda não ter sido gerada;
  const {name,address,locality, imgUrl} = coffeeStore;

  const handleUpvoteButton = () => {
    console.log("handle Upvite")
  }

  //O que há dentro das chaves é uma concatenação do texto simples com i id gerado dinamicamente na URL desta página;
  //O LEGACY BEHAVIOR permite que o elemento html Anchor possa ser usado na versão 13 do Next;
  return( 
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link legacyBehavior href="/">
              <a>← Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image 
            src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} 
            width={600} 
            height={360} 
            className={styles.storeImg} 
            alt={name}>
          </Image>
        </div>

        <div className={cls("glass",styles.col2)}>

          {address && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width={24} height="24"/>
              <p className={styles.text}>{address}</p>
            </div>
          )}

          {locality && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width={24} height="24"/>
              <p className={styles.text}>{locality}</p>
            </div>
          )}
          
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height="24"/>
            <p className={styles.text}>666</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>  
    </div>
  );
}

export default CoffeeStore;