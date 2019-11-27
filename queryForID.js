/*  Goal: Adapatation of a query written embedded in HTML
 *  
 *  This JavaScript file does:
 *  Grabs the provided drug name
 *  Parses out the name 
 *  Queries WikiData for ID of the supplied drug
 *       >WikiData indentifier of the DataBase passed to getID('string') determines which is the source
 *        database
 *  Parses out the ID from JSON file
 *  Returns the ID
 *  




 * 
 */

function parseURL() {
  
  //Grab the URLs
  const drugSubDirt = new URLSearchParams(window.location.search);

  //Create a clean variable
  return drugSubClean = clean(drugSubDirt.get('drug'));
  console.log(drugSubClean);
}

//Cleanup function
function clean (str){
  if(!str) return null
  
  let temp = str.trim()
  return temp.toLowerCase();
}

function getChoiceArray() {
  
  let arraySubClean = [];
  const arraySubDirt = new URLSearchParams(window.location.search);

  for (cnt = 0; cnt < 6; cnt++)  {
    arraySubClean[cnt] = clean(arraySubDirt.get(`chbx${cnt}`));
  }
  return arraySubClean;
}

function queryForID(idIdentifier) {

  query = `							
  SELECT DISTINCT ?drug ?drugLabel ?ID
  WHERE
  {
    VALUES ?idProp { wdt:${idIdentifier} }
    ?drug wdt:P31* wd:Q12140 .
    ?drug ?idProp ?ID . 

    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
`                                                                //end of query

 const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
 return url;
}


async function getID (url) {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  var drugUser = parseURL(); 
  var output;                              
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      // console.log(simpleResults[i].drug.value);
      // return simpleResults[i].ID;
      output = simpleResults[i].drug.value;
     }
  }
  return output;

}

async function queryForLD(idIdentifier) { //only works for aspirin and fentanyl

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?ld 

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .
OPTIONAL{ ?drug wdt:P2240 ?ld}



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                

   
  const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugUser = parseURL();
  let ld = [];                               
      
  for (i=0; i<simpleResults.length; i++){
    
      ld[i] =  simpleResults[i].ld;
     
  }
  return ld;
}




async function queryForChemicalStructure(idIdentifier) { 

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?chemStruct

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .

OPTIONAL{?drug wdt:P117 ?chemStruct} 



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
  const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice

  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugUser = parseURL();  
  let chemicalStructure = []                             
      
  for (i=0; i<simpleResults.length; i++){
      chemicalStructure[i] = simpleResults[i].chemStruct;
     }
  return chemicalStructure;
}



async function queryForPrimePharm(idIdentifier) { 
  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?pphLabel

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug {wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .


OPTIONAL{?drug wdt:P2175 ?pph}


  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
  const url = wdk.sparqlQuery(query)			                 //preparing to send querry to webservice
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugUser = parseURL();    
  let pph = [];                     
      
  for (i=0; i<simpleResults.length; i++){
    
       pph[i] = [simpleResults[i].pphLabel];
  }
 return pph;
}



// main(queryForID(P592))
async function queryForDrugInteraction(idIdentifier) {

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?sdiLabel

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .


OPTIONAL{?drug wdt:P769 ?sdi}



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
  const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugUser = parseURL();
  let drugInteraction = [];                            
      
  for (i=0; i<simpleResults.length; i++){

      drugInteraction[i] = simpleResults[i].sdiLabel;
  
  }
  return drugInteraction;
}



async function queryForArticles(idIdentifier) { 

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?msLabel 
WITH
{
SELECT DISTINCT ?drug ?ID 
WHERE {
  VALUES ?idProp { wdt:P662 }
  VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .
} LIMIT 1000
} AS %RESULTS WITH {
  SELECT DISTINCT ?drug ?ID ?ms
  WHERE {
    INCLUDE %RESULTS
    ?ms wdt:P921 ?drug
  }
} AS %ARTICLES {
  INCLUDE %ARTICLES
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
  const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugUser = parseURL();
  let articles = []                             
      
  for (i=0; i<simpleResults.length; i++){

      
     articles[i] = simpleResults[i].msLabel;
  }
  return articles;
}



async function queryForPregnancyCategory(idIdentifier) { 

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?pcLabel

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .


OPTIONAL{?drug wdt:P3489 ?pc}



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
  const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugUser = parseURL();
  let pregnancyCategory = []                             
      
  for (i=0; i<simpleResults.length; i++){

      
     pregnancyCategory[i] = simpleResults[i].pcLabel;
  }
  return pregnancyCategory;
}


