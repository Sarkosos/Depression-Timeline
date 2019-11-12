/*  Goal: Adapatation of a query written embedded in HTML
 *  
 *  This JavaScript file does:
 *  Grabs the provided drug name
 *  Parses out the name 
 *  Queries WikiData for PubChem ID of the supplied drug
 *  Parses out the ID from JSON file
 *  Returns a PubChem ID
 *  
 */

//Grab the URLs
const drugSubDirt = new URLSearchParams(window.location.search);
//console.log(drugSubmitted);

//Cleanup function
function clean (str){
  if(!str) return null
  
  let temp = str.trim()
  return temp.toLowerCase();
}

//Create a clean variable
const drugSubClean = clean(drugSubDirt.get('drug'));
//console.log(drugSubClean);

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
  const response = await fetch(url)					                 //sends querry (in string) to webservice
  const results = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

 /*
  document.getElementById('output').innerHTML =              //displays the result on the page
    JSON.stringify(simpleResults, undefined, 2);             //simplifys JSON to not display uri, etc.
  */

  let drugUser = drugSubClean;                               
      
  for (i=0; i<simpleResults.length; i++){
    if (simpleResults[i].drug.label === drugUser){
      console.log(simpleResults[i].ID);                      //prints ID for adenosine into console
      return simpleResults[i].ID;
     }
  }
}


main()