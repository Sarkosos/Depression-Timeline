/*  
 *  
 *  This JavaScript file does:
 *  Contains a set of functions divided into 2 groups
 *      WikiData queries
 *          Typically take a wikidata identifier of a drug as an argument
 *          Return an array of results: minimal lenght 0
 *          List:     
 *               queryForLD
 *               queryForChemicalStructure
 *               queryForPrimePharm
 *               queryForDrugInteraction
 *               queryForArticles
 *               queryForPregnancyCategory
 *               queryForID    
 *          Exeptions
 *               queryForID 
 *                    Takes as an argument a type of ID required 
 *                    Returns an url that is then fed to accessory function getID
 *      Acessory functions
 *          Various functionality that is needed for the running of the code
 *          Returns are individual
 *          List:
 *              parseURL
 *                  No argument, takes the user's DRUG NAME input from URL
 *                  Feeds a dirty user's imput as an argument to function clean
 *                  Returns a cleaned variable
 *              clean
 *                  Takes a string argument
 *                  Returns trimmed and low-caseed argument
 *              getChoiceArray
 *                  Takes no argument, takes the user's CHOICE OF RESULTS TO BE DISPLAYED input from URL
 *                  Cleans the input using clean function
 *                  Returns an array of booleans, TRUE (to be displayed) or FALSE (not to be displayed)
 *              getID
 *                  Takes URL as an argument (from queryForID)
 *                  Returns a Wiki-Data identifier of the drug requested in the queryForID
 *  
 *
 * This file does nothing on it's own! It only contains functions, that need to be called!
 */

// ACCESSORY FUNCTIONS

function parseURL() {
  //Grab the URLs
  const drugSubDirt = new URLSearchParams(window.location.search);

  //Create a clean variable
  return drugSubClean = clean(drugSubDirt.get('drug'));
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

// QUERY FUNCTIONS

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

 const url = wdk.sparqlQuery(query)                          //preparing to send querry to webservice
 return url;
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
  var ld =[];  
  // let myStringIsStrong = '['                             
      
  for (i=0; i<simpleResults.length; i++){
    ld[i] = {'name' : simpleResults[i].ld};
    // myStringIsStrong = `{"name": ${simpleResults[i]}}`
    // ld = Object.assign({}, ld, {"name" : simpleResults[i].ld} );
      // ld = ld.concat({"name" : simpleResults[i].ld});
     // ld = JSON.parse (`{ name: simpleResults[i]}`)
  }
  // console.log(ld);
  for(j = 0; j<ld.length; j++){
    
  }
  ld = Object.assign({},ld);
  // ld = JSON.parse (myStringIsStrong);

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
      chemicalStructure = Object.assign({},chemicalStructure);

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
`                                                                //end of query                                                           

   
  const url = wdk.sparqlQuery(query)			                 //preparing to send querry to webservice
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugUser = parseURL();    
  let pph = [];                     
      
  for (i=0; i<simpleResults.length; i++){
    
       pph[i] = [simpleResults[i].pphLabel];
  }
   pph = Object.assign({},pph);

 return pph;
}


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
   drugInteraction = Object.assign({},drugInteraction);

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
   articles = Object.assign({},articles);

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
   pregnancyCategory = Object.assign({},pregnancyCategory);

  return pregnancyCategory;
}


