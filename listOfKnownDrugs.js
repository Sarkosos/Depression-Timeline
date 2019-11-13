/*
  Use: To generate a list of drugs that are known by the WikiData, and therefore
  that can be queried by this programme

*/


query = `							
SELECT DISTINCT ?drug ?drugLabel ?ID
WHERE
{
  VALUES ?idProp { wdt:P662 }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID . 

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`                                                                //end of query
   
const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
async function main () {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */
let drugList = '';
var counter = 0;
//  let drugUser = drugSubClean;                               
  
  for (i=0; i < simpleResults.length; i++){
    drugList += `<option value="${simpleResults[i].drug.label}">`;
    counter++;
    console.log(simpleResults[i].drug.label);
  }

console.log(counter);
document.getElementById('drug').innerHTML = drugList;
}

main()