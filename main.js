// This is the 'lynchpin'  file for retrieving the outputs of the queries and transforming it into useful output
// This JavaScript does:
// Take the User choice:
// 			Which drug is the user interested in?
// 				Resolved in 'finaliseResults' by calling queryForID
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
// 				All functions return a structured JSON output containing the results
// 			Returns a JSON with ordered results given by the order as described before (when discussing valArray).
// Feed the user's input into the calculation structure: bring the functions together
// 			Resolved in  'finaliseResults', function that takes no arguments
// 				Take the user's input of a drug, get its identifier, and feed it identifier into 'createJSONOutput'
// 			Returns a JSON output of 'createJSONOutput'
//
// Optional: Remove the preloader when the data is retrieved
// 			Resolved in 'feedToHTML' function
// 				Replaces the preloader with an empty opaque divider
//
// Final Result: Present the data by calling tree.js 
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

    dataLD 	= (valArray[0]) ? await queryForLD(idIdentifier): 0;
    dataChemStr = (valArray[1]) ? await queryForChemicalStructure(idIdentifier): 0;
    dataPrimPha = (valArray[2]) ? await queryForPrimePharm(idIdentifier): 0;
    dataDrugInt = (valArray[3]) ? await queryForDrugInteraction(idIdentifier): 0;
    dataArticle = (valArray[4]) ? await queryForArticles(idIdentifier): 0;
    dataPregCat = (valArray[5]) ? await queryForPregnancyCategory(idIdentifier): 0;

    name = parseURL();

	// Assign data resulting from queries into a JSON variable
	// TODO make so that it interacts with checkboxes
	outJSON =   {
				"name": name,
				"children":	[
						dataLD,
						dataChemStr,
					 	dataPrimPha,
					   	dataDrugInt,
						dataArticle,
						dataPregCat
						]
				};

	return outJSON;
}

// Construct the final array
async function finaliseResults() {
   // Retrieve a WikiData-useful identifier of the drug provided
   var input = queryForID(); // TO DO: combine the 2 functions

   // Get the Array provided by createFinalOutput, provide the WikiData identifier
   let finalJSON = createJSONOutput(await input);
   

   // Wait for the Promise to be resolved and then return it
   return finalJSON;
}


async function feedToHTML(){
	data = await finaliseResults();
	createTree(data);
	document.getElementById('output').innerHTML = '<div ><pre> </pre><div>';
}

feedToHTML();
