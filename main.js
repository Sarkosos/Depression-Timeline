 // This is the 'lynchpin'  file for doing the computations
let valArray = getChoiceArray();

var input = getID(queryForID('P592'));
	input.then(function(result){
	// console.log(result);
});

// console.log(getID(queryForID('P592')));
// console.log(getID(queryForID('P662')));
// console.log(queryForPrimePharm('Q18216'));
// console.log(queryForPregnancyCategory('Q18216'));

// console.log(test);

function createFinalOutput(idIdentifier){
	let finalArray = [0]; 

	finalArray = [ 
						(valArray[0]) ? queryForLD(idIdentifier): 0, 
						(valArray[1]) ? queryForChemicalStructure(idIdentifier): 0,
						(valArray[2]) ? queryForPrimePharm(idIdentifier): 0,
						(valArray[3]) ? queryForDrugInteraction(idIdentifier): 0,
						(valArray[4]) ? queryForArticles(idIdentifier): 0,
						(valArray[5]) ? queryForPregnancyCategory(idIdentifier): 0,
				 ];


	return finalArray;
}

// console.log(createFinalOutput('Q18216'));

// let resultArray = JSON.stringify(createFinalOutput(await.input)); 

async function main() {
	// body...
   let resultArray = createFinalOutput(await input); 

   console.log(resultArray);
}

main();