// This is the 'lynchpin'  file for retrieving the outputs of the queries and transforming it into useful output
// This JavaScript does:
// Take the User choice: 
// 			Which drug is the user interested in?
// 				Resolved in 'finaliseResults' by calling getID with passing queryForID as an argument
// 					Both of these functions can be seen in queryForID.js file
// 				Returns a WikiData identifier of the drug: assigned as an 'input' variable, 
// 				which is latter fed to following functions
// 			Which categories is the user interested in? 
// 				Resolved in variable 'valArray', by calling functon 'getChoiceArray' which returns an ordered array of booleans
// 					The order of information in the array is as follows:
// 					LD50, ChemicalStructure, PrimaryPharmacology, DrugInteraction, Article, PregnancyCategory
// 					if boolean == true, the information is requested, if boolean == false, it is not
//				Returned as an array of booleans 'valArray' which is a global variable
// 					Will be called when choosing which datapoints to retrieve
// Retrieve the proper datapoints
// 			Resolved in 'createJSONOutput' function, which takes WikiData identifier of the requested drug as an argument
// 				Calls number of functions, all from 'queryForID.js' JavaScript file.
// 				All functions called take WikiData identifier of a drug as an argument,
// 				All functions return an array of results, with minimal length of 0
// 			Returns a JSON with ordered results given by the order as described before (when discussing valArray).
// Feed the user's input into the calculation structure: bring the functions together
// 			Resolved in  'finaliseResults', function that takes no arguments
// 				Take the user's input of a drug, get its identifier, and feed it identifier into 'createJSONOutput'
// 			Returns a JSON output of 'createJSONOutput'
// 
// Optional: Feed the result to HTML
// 			Resolved in 'feedToHTML' function
// 				Prints the output of 'finaliseResults' into an HTML element with id 'output' in 'callForID.html' page as a 
// 				<pre> element
// 
// Final Result: an array of arrays called   finalJSON
// 				 has 6 primary elements, filled with arrays of variable lenghts 
// 				 dependent on the data available on WikiData
// 

// Get the User choice
let valArray = getChoiceArray();

async function createJSONOutput(idIdentifier){
	// Declare a variable 'outJSON' as an empty JSON variable 
	let outJSON = {}; 

	// Assign values returned from queries to 'data' variables
	// Change the output into a JSON
	// Take into consideration whether the user wanted this information
	// If the information is not wanted, in place of a result return 0;
	
    dataLD 		= Object.assign({}, (valArray[0]) ? await queryForLD(idIdentifier): 0);
    dataChemStr = Object.assign({}, (valArray[1]) ? await queryForChemicalStructure(idIdentifier): 0);
    dataPrimPha = Object.assign({}, (valArray[2]) ? await queryForPrimePharm(idIdentifier): 0);
    dataDrugInt = Object.assign({}, (valArray[2]) ? await queryForDrugInteraction(idIdentifier): 0);
    dataArticle = Object.assign({}, (valArray[4]) ? await queryForArticles(idIdentifier): 0);
    dataPregCat = Object.assign({}, (valArray[5]) ? await queryForPregnancyCategory(idIdentifier): 0);

    name = parseURL(); 

    // console.log(dataLD);

    // outJSON =   {
				// "name": name
				// };


    // var newUser = "children";
    // var newValue = dataLD;
    // outJSON[newUser] = newValue ;

    // console.log(outJSON);

	// Assign data resulting from queries into a JSON variable
	outJSON =   {
				"name": name, 
				"children":	[
						dataLD,
						{
						"name"		 : "ChemStr",
						"children"   : 	dataChemStr
						},
						{
						"name"		 :  "PrimPha",
						"children"   : 	dataPrimPha
					    },
					    {
						"name"		 : "DrugInt",
						"children"   : 	dataDrugInt
						},
						{	
						"name"		 : "Article",
						"children"   : 	dataArticle
						},
						{
						"name"		 : "PregCat",
						"children"   : 	dataPregCat
						}
						]
				};

	console.log(outJSON); // IT IS FULL OF GOOD STUFF
	outJSON = Object.assign({}, outJSON);
	return outJSON;
}

// Construct the final array 
async function finaliseResults() {
   // Retrieve a WikiData-useful identifier of the drug provided
   var input = getID(queryForID('P592'));

   // Get the Array provided by createFinalOutput, provide the WikiData identifier
   let finalJSON = createJSONOutput(await input);
   console.log(await finalJSON);
   //finalJSON = JSON.stringify(finalJSON, undefined, 2);
   // Wait for the Promise to be resolved and then return it
   console.log(await finalJSON); 				//FULL OF SZYMON'S SOUL
   return finalJSON;
}


async function feedToHTML(){
	data = await finaliseResults();

	txt  = JSON.stringify(data, undefined, 2);
	document.getElementById('output').innerHTML = '<pre>' + txt + '</pre>';
}

feedToHTML();

// TESTING AREA
// async function testingArea() {
// 	composeJSONAlternatively(getID(queryForID('P592')));

// }

// testingArea();

createTree();