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

  let temp = str.trim() //Look up what does
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

  var drugUser = parseURL();
  var output;

  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){

      output = simpleResults[i].drug.value;
     }
  }
  return output;
}


async function queryForLD(idIdentifier) { //only works for aspirin and fentanyl

  query =
`
SELECT DISTINCT ?drug ?drugLabel ?ld

WHERE {
   VALUES ?drug { wd:${idIdentifier}  }
  ?drug wdt:P31* wd:Q12140 .
OPTIONAL{ ?drug wdt:P2240 ?ld}

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`


  const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format

  const simpleResults = wdk.simplify.sparqlResults(results)

  var ld = {};
  // let StrongestString = '{ ';
  let StrongestString = `{
            "name"     : "LD50",
            "children"   : [
            `;
  //add from simple results to the string
  for (i=0; i<simpleResults.length; i++){
    StrongestString += `{"name" : "${simpleResults[i].ld}"}, `;
  }

  //get rid of last comma & add closed bracket.
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;
  ld = JSON.parse(StrongestString);


  // DO NOT DELETE THIS CHUNK! It still may be useful later

  // for (i = 0; i < counter; i++){
  //   eval(`
  //     ld.name = ld.name${i};
  //     delete ld.name${i};
  //     `);
  // }

  return ld;
}



async function queryForChemicalStructure(idIdentifier) {

  query =
`
SELECT DISTINCT ?drug ?drugLabel ?chemStruct

WHERE {
   VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .

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

  console.log(StrongestString);

  chemicalStructure = JSON.parse(StrongestString);

  return chemicalStructure;
}


async function queryForPrimePharm(idIdentifier) {
  query =
`
SELECT DISTINCT ?drug ?drugLabel ?pphLabel

WHERE {
   VALUES ?drug {wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .

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
  console.log(StrongestString);

  pph = JSON.parse(StrongestString);


 return pph;
}


async function queryForDrugInteraction(idIdentifier) {

  query =
`
SELECT DISTINCT ?drug ?drugLabel ?sdiLabel

WHERE {
  VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .

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
  console.log(StrongestString);

  drugInteraction = JSON.parse(StrongestString);

  return drugInteraction;
}


async function queryForArticles(idIdentifier) {

  query =
`
SELECT DISTINCT ?drug ?drugLabel ?msLabel
WHERE {
  VALUES ?drug { wd:${idIdentifier}}
  ?drug wdt:P31* wd:Q12140 .
    ?ms wdt:P921 ?drug

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
    // holdMyString = holdMyString.replace(' " ', " ' ");
    holdMyString = holdMyString.replace(/([`'"])/g, "");
    StrongestString += `{"name" : "${holdMyString}"}, `;
  }
  StrongestString = StrongestString.slice(0, StrongestString.length - 2);
  StrongestString += `]}`;
  console.log(StrongestString);

  articles = JSON.parse(StrongestString);


  return articles;
}


async function queryForPregnancyCategory(idIdentifier) {

  query =
`
SELECT DISTINCT ?drug ?drugLabel ?pcLabel

WHERE {
   VALUES ?drug { wd:${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .

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
  console.log(StrongestString);

  pregnancyCategory = JSON.parse(StrongestString);
  return pregnancyCategory;
}
