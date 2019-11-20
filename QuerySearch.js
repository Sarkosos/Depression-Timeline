//Query for finding minimum lethal dose (not many)

function queryLD(lethalDose) {

  query = `SELECT DISTINCT ?drug ?drugLabel ?ld
WHERE
{
  ?drug wdt:P31* wd:Q12140 .
?drug wdt:P2240 ?ld

  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}`

const url = wdk.sparqlQuery(query)					                 //preparing to send querry to webservice
return url;
}
