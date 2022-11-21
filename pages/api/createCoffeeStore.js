//API que utiliza o AIRTABLE para captar dados de uma página renderizada no servidor e servir as páginas dinâmicas que forem renderizadas no lado do cliente;

const Airtable = require('airtable');

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_KEY);

const table = base("coffee");
console.log({table})

const createCoffeeStore = async (req, res) => {
  console.log({req})

  if(req.method === "POST"){
    try{
      //find a record
      const findCoffeeStoreRecords = await table.select({
        filterByFormula: `id="1"`,
      }).firstPage();

      console.log({ findCoffeeStoreRecords });

      if(findCoffeeStoreRecords.length !== 0){
        const records = findCoffeeStoreRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json({records});
      }else{
        //create a record
        const createRecords = await table.create([
          {
            fields: {
              id: "1",
              name: "aaaaaaa",
              address: "My address",
              locality: "Some place",
              voting: 2,
              imgUrl: "http://image.com"
            }
          }
        ])

        const records = createRecords.map((record) => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      }
    }catch(err) {
      console.log("Error finding store", err);
      res.status(500);
      res.json({message: "Error finding store", err});
    }
  }
}

export default createCoffeeStore;