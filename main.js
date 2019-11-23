 // This is the 'lynchpin'  file for doing the computations
let valArray = getChoiceArray();

// var input = getID(queryForID('P592'));
// 	input.then(function(result){
// 	// console.log(result);
// });

// let resLD = queryForID(idIdentifier);
// 	resLD.then(function(result){
// 		// console.log(result)
// });

// async function test1(){
// 	// let finalTest = resLD
// 	let idIdentifier = await input;

// 	let resLD = queryForLD(idIdentifier);
// 	resLD.then(function(result){
// 		// console.log(result)
// 	});

// 	let finalTest = await resLD;
// 	console.log(finalTest);
// }

// test1();

// console.log(getID(queryForID('P592')));
// console.log(getID(queryForID('P662')));
// console.log(queryForPrimePharm('Q18216'));
// console.log(queryForPregnancyCategory('Q18216'));

// console.log(test);

async function createFinalOutput(idIdentifier){
	
	
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

	finalArray = [ 
						(valArray[0]) ? await resLD: 0, 
						(valArray[1]) ? await resChemStr: 0,
						(valArray[2]) ? await resPrimPha: 0,
						(valArray[3]) ? await resDrugInt: 0,
						(valArray[4]) ? await resArticle: 0,
						(valArray[5]) ? await resPregCat: 0,
				 ];


	return finalArray;
}

// console.log(createFinalOutput('Q18216'));

// let resultArray = JSON.stringify(createFinalOutput(await.input)); 

async function finaliseResultsFromPromises() {
	// body...
   var input = getID(queryForID('P592'));
	input.then(function(result){
	// console.log(result);
   });

   // let resultArray = createFinalOutput(await input); 

   let finArr = createFinalOutput(await input);
   	   finArr.then(function(result){});

   // console.log(resultArray);
   console.log(await finArr);
}

finaliseResultsFromPromises();