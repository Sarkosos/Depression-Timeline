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
  // body...

  //Grab the URLs
  const drugSubDirt = new URLSearchParams(window.location.search);
  //console.log(drugSubDirt);

  /*
  potential alternative for a cleanup function
  function parseURLParams(url) {
      var queryStart = url.indexOf("?") + 1,
          queryEnd   = url.indexOf("#") + 1 || url.length + 1,
          query = url.slice(queryStart, queryEnd - 1),
          pairs = query.replace(/\+/g, " ").split("&"),
          parms = {}, i, n, v, nv;

      if (query === url || query === "") return;

      for (i = 0; i < pairs.length; i++) {
          nv = pairs[i].split("=", 2);
          n = decodeURIComponent(nv[0]);
          v = decodeURIComponent(nv[1]);

          if (!parms.hasOwnProperty(n)) parms[n] = [];
          parms[n].push(nv.length === 2 ? v : null);
      }
      return parms;
  }
  */

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
  // body...
  let arraySubClean = [];
  const arraySubDirt = new URLSearchParams(window.location.search);

  for (cnt = 0; cnt < 5; cnt++)  {
    arraySubClean[cnt] = clean(arraySubDirt.get(`chbx${cnt}`));
    console.log(arraySubClean);
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

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */

  let drugUser = parseURL();                               
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      console.log(simpleResults[i].ID);                      //prints ID for adenosine into console
      return simpleResults[i].ID;
     }
  }
}

function queryForLD(idIdentifier) { //only works for aspirin and fentanyl

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?ld 

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { ${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .
OPTIONAL{ ?drug wdt:P2240 ?ld}



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
 const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
 return url;
}


async function getID (url) {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */

  let drugUser = parseURL();                               
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      console.log(simpleResults[i].ID);                      //prints ID for adenosine into console
      return simpleResults[i].ID;
     }
  }
}

// main(queryForID(P592))
function queryForChemicalStructure(idIdentifier) { 

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?chemStruct

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { ${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .

OPTIONAL{?drug wdt:P117 ?chemStruct} 



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
 const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
 return url;
}


async function getID (url) {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */

  let drugUser = parseURL();                               
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      console.log(simpleResults[i].ID);                      
      return simpleResults[i].ID;
     }
  }
}

// main(queryForID(P592))
function queryForPrimePharm(idIdentifier) { 

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?pphLabel

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { ${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .


OPTIONAL{?drug wdt:P2175 ?pph}


  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
 const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
 return url;
}


async function getID (url) {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */

  let drugUser = parseURL();                               
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      console.log(simpleResults[i].ID);                     
      return simpleResults[i].ID;
     }
  }
}

// main(queryForID(P592))
function queryForDrugInteraction(idIdentifier) {

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?sdiLabel

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { ${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .


OPTIONAL{?drug wdt:P769 ?sdi}



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
 const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
 return url;
}


async function getID (url) {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */

  let drugUser = parseURL();                               
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      console.log(simpleResults[i].ID);                      
      return simpleResults[i].ID;
     }
  }
}

// main(queryForID(P592))


// main(queryForID(P592))
function queryForPregnancyCategory(idIdentifier) { 

  query = 						
`							
SELECT DISTINCT ?drug ?drugLabel ?ID ?pcLabel

WHERE {
   VALUES ?idProp { wdt:P662 }
   VALUES ?drug { ${idIdentifier} }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .


OPTIONAL{?drug wdt:P3489 ?pc}



  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query                                                            //end of query

   
 const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
 return url;
}


async function getID (url) {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */

  let drugUser = parseURL();                               
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      console.log(simpleResults[i].ID);                      
      return simpleResults[i].ID;
     }
  }
}

// main(queryForID(P592))