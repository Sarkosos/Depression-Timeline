/*  
 *
 *  This JavaScript file does:
 *  Contains a set of functions divided into 2 groups
 *      WikiData queries
 *          Typically take a wikidata identifier of a drug as an argument
 *          Return a structured JSON output containing the results
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
 *                    Takes no argument
 *                    Returns WikiData identifier of the drug user put in
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
 *              
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

  let temp = str.trim(); // Remove whitespace from both sides of a string
  return temp.toLowerCase(); // Puts everything to lower case
}
// Returns which data points the user wants (See checkboxes)
function getChoiceArray() {
  let arraySubClean = [false, false, false, false, false];
  const arraySubDirt = new URLSearchParams(window.location.search);

  for (i = 0; i < 6; i++)  {
    arraySubClean[i] = clean(arraySubDirt.get(`chbx${i}`));
  }
  return arraySubClean;
}



// QUERY FUNCTIONS

async function queryForID() {

  query = `
    SELECT DISTINCT ?drug ?drugLabel ?ID
  WHERE
  {
    ?drug wdt:P31* wd:Q12140 .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
`                                                                //end of query

 const url = wdk.sparqlQuery(query)                          //preparing to send querry to webservice
 const response = await fetch(url)                           //sends querry (in string) to webservice
  const results  = await response.json()                       //gives body of http in json format

  const simpleResults = wdk.simplify.sparqlResults(results)

  var drugUser = parseURL(); //Extracts user drug
  var output;

  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){ // Searches for the users drug in wikidata

      output = simpleResults[i].drug.value;
     }
  }
  return output; //Returns the WikiData ID of the users drug so we can perform queries
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

  var ld = {};
  // The code below is responsible for creating a structured JSON the structure looks as follows:
  // "name": "aspartame",
  // "children": [
  //   {
  //     "name": "LD50",
  //     "children": [
  //       {
  //         "name": "undefined"
  //       }
  //     ]
  //   },
  // The code operates by creating a string with a JSON format and then casting
  // it into a JSON using JSON.parse
  let StrongestString = `{
            "name"     : "LD50",
            "children"   : [
            `;

  for (i=0; i<simpleResults.length; i++){
    StrongestString += `{"name" : "${simpleResults[i].ld}"}, `;
  }
  // This line is here to delete the last comma in the string
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;
  ld = JSON.parse(StrongestString);

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

  var chemicalStructure = {};
  let StrongestString = `{
            "name"     : "Chemical Structure",
            "children"   : [
            `;

  for (i=0; i<simpleResults.length; i++){
    StrongestString += `{"name" : "${simpleResults[i].chemStruct}"}, `;
  }
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;

  chemicalStructure = JSON.parse(StrongestString);

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

  let pph = [];
let StrongestString = `{
            "name"     : "Primary Pharmacology",
            "children"   : [
            `;

  for (i=0; i<simpleResults.length; i++){
    StrongestString += `{"name" : "${simpleResults[i].pphLabel}"}, `;
  }
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;

  pph = JSON.parse(StrongestString);


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

  let drugInteraction = {};

  let StrongestString = `{
            "name"     : "Significant Drug Interaction",
            "children"   : [
            `;

  for (i=0; i<simpleResults.length; i++){
    StrongestString += `{"name" : "${simpleResults[i].sdiLabel}"}, `;
  }
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;

  drugInteraction = JSON.parse(StrongestString);

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

  let articles = {};

    let StrongestString = `{
            "name"     : "Articles",
            "children"   : [
            `;
  let holdMyString = "";



  for (i=0; i<simpleResults.length; i++){
    holdMyString = simpleResults[i].msLabel;
    holdMyString = holdMyString.replace(/([`'"])/g, ""); // Some paper titles had
    // quotation marks or apostrophes which broke the string thus we had to delete
    //those which this method does
    StrongestString += `{"name" : "${holdMyString}"}, `; 
  }
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;

  articles = JSON.parse(StrongestString);


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

     let StrongestString = `{
            "name"     : "Pregnancy Category",
            "children"   : [
            `;

  for (i=0; i<simpleResults.length; i++){
    StrongestString += `{"name" : "${simpleResults[i].pcLabel}"}, `;
  }
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;

  pregnancyCategory = JSON.parse(StrongestString);
  return pregnancyCategory;
}
