 // This is the 'lynchpin'  file for doing the computations
let valArray = getChoiceArray();

console.log(getID(queryForID('P592')));
console.log(getID(queryForID('P662')));
console.log(queryForPrimePharm('Q18216'));


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



}

createFinalOutput('Q18216');