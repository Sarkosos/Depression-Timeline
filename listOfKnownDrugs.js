/*
  Use: To generate a list of drugs that are known by the WikiData, and therefore
  that can be queried by this programme

*/
//TODO update this method

query = `							
  SELECT DISTINCT ?drug ?drugLabel ?ID
  WHERE
  {
    ?drug wdt:P31* wd:Q12140 .
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
`                                                                //end of query
   
const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
async function main () {
  const response = await fetch(url)					                  //sends querry (in string) to webservice
  const results  = await response.json()			               	 //gives body of http in json format
      
  const simpleResults = wdk.simplify.sparqlResults(results) 

  let drugList = '';
  let counter = 0;
  
  for (i=0; i < simpleResults.length; i++){
    drugList += `<option value="${simpleResults[i].drug.label}">`;
    counter++;
  }
console.log(counter);
document.getElementById('drug').innerHTML = drugList;
}

main()
