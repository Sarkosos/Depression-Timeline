// Under development, 

async function queryForLDAlternative(idIdentifier) { //only works for aspirin and fentanyl

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

  // let drugUser = parseURL();
  // let ld = [];                               
      
  return simpleResults;
}




async function queryForChemicalStructureAlternative(idIdentifier) { 

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

  // let drugUser = parseURL();  
  // let chemicalStructure = []                             
      
  return simpleResults;
}



async function queryForPrimePharmAlternative(idIdentifier) { 
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

  // let drugUser = parseURL();    
  // let pph = [];                     
      
 return simpleResults;
}



// main(queryForID(P592))
async function queryForDrugInteractionAlternative(idIdentifier) {

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

  // let drugUser = parseURL();
  // let drugInteraction = [];                            
      
  
  return simpleResults;
}



async function queryForArticlesAlternative(idIdentifier) { 

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

  // let drugUser = parseURL();
  // let articles = []                             
      
  return simpleResults;
}



async function queryForPregnancyCategoryAlternative(idIdentifier) { 

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

  // let drugUser = parseURL();
  // let pregnancyCategory = []                             
  console.log (simpleResults);
  return simpleResults;
}


async function composeJSONAlternatively(idIdentifier){
  let valArray = getChoiceArray();

  let mySonJson = {};

  // mySonJson = $.extend(true, queryForLDAlternative, queryForChemicalStructureAlternative);

  (valArray[0]) ? $.extend(true, mySonJson, await queryForLDAlternative(idIdentifier)): null;
  (valArray[1]) ? $.extend(true, mySonJson, await queryForChemicalStructureAlternative(idIdentifier)): null;
  (valArray[2]) ? $.extend(true, mySonJson, await queryForPrimePharmAlternative(idIdentifier)): null;
  (valArray[3]) ? $.extend(true, mySonJson, await queryForDrugInteractionAlternative(idIdentifier)): null;
  (valArray[4]) ? $.extend(true, mySonJson, await queryForArticlesAlternative(idIdentifier)): null;
  (valArray[5]) ? $.extend(true, mySonJson, await queryForPregnancyCategoryAlternative(idIdentifier)): null;

  // $.extend()
  console.log(JSON.stringify(mySonJson));
  return mySonJson;
}