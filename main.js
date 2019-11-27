// This is the 'lynchpin'  file for doing the computations
// This JavaScript does:
// Take the User choice: 
// 			Which drug is the user interested in?
// 			Which categories is the user interested in? 
// Retrieve the proper datapoints
// Create the final array: populate it with resolved Promises
// Create final output: produce it as an array of arrays, not as a Promise
// 
// Final Result: an array of arrays called   finArr
// 				 has 6 primary elements, filled with arrays of variable lenghts 
// 				 dependent on the data available on WikiData
// 

// Get the User choice
let valArray = getChoiceArray();

// Construct a Promise type of array, fill it with values
async function createFinalOutput(idIdentifier){
	let finalArray = [0]; 

    ldData = await queryForLD(idIdentifier);
    console.log(JSON.stringify(ldData, undefined, 2));

	// Assign values unpacked from Promises retrieved from Queries into an array
	finalArray = [ 
						{
						"LD50"   :  (valArray[0]) ? await queryForLD(idIdentifier): 0, 
						"ChemStr":  (valArray[1]) ? await queryForChemicalStructure(idIdentifier): 0,
						"PrimPha":  (valArray[2]) ? await queryForPrimePharm(idIdentifier): 0,
						"DrugInt":  (valArray[3]) ? await queryForDrugInteraction(idIdentifier): 0,
						"Article":  (valArray[4]) ? await queryForArticles(idIdentifier): 0,
						"PregCat":  (valArray[5]) ? await queryForPregnancyCategory(idIdentifier): 0,
						}
				 ];
	// finalArray = {
	// 	"LD50"   : ldData
	// }

	console.log(finalArray)	 
	return finalArray;
}

// Construct the final array 
async function finaliseResultsFromPromises() {
   // Retrieve a WikiData-useful identifier of the drug provided
   var input = getID(queryForID('P592'));

   // Get the Array provided by createFinalOutput, provide the WikiData identifier
   let finArr = createFinalOutput(await input);

   // Wait for the Promise to be resolved and then return it
   return finArr;
}

async function output(){
	data = await finaliseResultsFromPromises();
	txt = JSON.stringify(data, undefined, 2);
	document.getElementById('output').innerHTML = '<pre>' + txt + '</pre>';
}

output();