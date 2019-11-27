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
	
	// Create ways how to unpack Promises returned by the primary Query functions
	let resLD = queryForLD(idIdentifier);
		resLD.then(function(result){});

	let resChemStr = queryForChemicalStructure(idIdentifier);
		resChemStr.then(function(result){});

	let resPrimPha = queryForPrimePharm(idIdentifier);
		resPrimPha.then(function(result){});

	let resDrugInt = queryForDrugInteraction(idIdentifier);
		resDrugInt.then(function(result){});
	
	let resArticle = queryForArticles(idIdentifier);
		resArticle.then(function(result){});
	
	let resPregCat = queryForPregnancyCategory(idIdentifier);
		resPregCat.then(function(result){});


	let finalArray = [0]; 

	// let holdLD			= (valArray[0]) ? await resLD: 0;
	// let holdChemStr		= (valArray[1]) ? await resChemStr: 0;
	// let holdPrimPha		= (valArray[2]) ? await resPrimPha: 0;
	// let holdDrugInt		= (valArray[3]) ? await resDrugInt: 0;
	// let holdArticle		= (valArray[4]) ? await resArticle: 0;
	// let holdPregCat		= (valArray[5]) ? await resPregCat: 0;


	// Assign values unpacked from Promises retrieved from Queries into an array
	finalArray = [ 
						`{
						"LD50"   :  ${(valArray[0]) ? await resLD: 0}, 
						"ChemStr":  ${(valArray[1]) ? await resChemStr: 0},
						"PrimPha":  ${(valArray[2]) ? await resPrimPha: 0},
						"DrugInt":  ${(valArray[3]) ? await resDrugInt: 0},
						"Article":  ${(valArray[4]) ? await resArticle: 0},
						"PregCat":  ${(valArray[5]) ? await resPregCat: 0},
						}`
						
						// `{
						// "LD50"   :  ${holdLD}, 
						// "ChemStr":  ${holdChemStr},
						// "PrimPha":  ${holdPrimPha},
						// "DrugInt":  ${holdDrugInt},
						// "Article":  ${holdArticle},
						// "PregCat":  ${holdPregCat}	
						// }`
				 ];

	console.log(finalArray)	 
	return finalArray;
}

// Construct the final array 
async function finaliseResultsFromPromises() {
   
   // Retrieve a WikiData-useful identifier of the drug provided
   var input = getID(queryForID('P592'));
       input.then(function(result){});

   // Get the Array provided by createFinalOutput, provide the WikiData identifier
   let finArr = createFinalOutput(await input);
   	   finArr.then(function(result){});

   // Wait for the Promise to be resolved and then return it
   // console.log(JSON.stringify(await finArr));
   return finArr;
}

async function output(){
	document.getElementById('output').innerHTML = await finaliseResultsFromPromises();
}

output();