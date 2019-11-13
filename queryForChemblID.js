/*  Goal: Adapatation of a query written embedded in HTML
 *  
 *  This JavaScript file does:
 *  Grabs the provided drug name
 *  Parses out the name 
 *  Queries WikiData for Chembl ID of the supplied drug
 *  Parses out the ID from JSON file
 *  Returns a Chembl ID
 *  
 */

function parseURL() {
  // body...

  //Grab the URLs
  const drugSubDirt = new URLSearchParams(window.location.search);
  //console.log(drugSubDirt);


  //Cleanup function
  function clean (str){
    if(!str) return null
    
    let temp = str.trim()
    return temp.toLowerCase();
  }

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

function queryForID() {
  // body...

  query = `							
  SELECT DISTINCT ?drug ?drugLabel ?ID
  WHERE
  {
    VALUES ?idProp { wdt:P592 }
    ?drug wdt:P31* wd:Q12140 .
    ?drug ?idProp ?ID . 

    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
`                                                                //end of query

   
 const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
 return url;
}


async function main (url) {
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
      console.log(simpleResults[i].ID + ' is a Chembl ID');                      //prints ID for adenosine into console
      return simpleResults[i].ID;
     }
  }
}


main(queryForID())