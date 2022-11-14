import '../styles/globals.css'

//Aqui ficam todos componentes que ficarão presentes em todas as rotas da aplicação;
function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Component {...pageProps} />
    </div>

  );
}


export default MyApp
