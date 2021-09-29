document.getElementById('activities').addEventListener("click",function(e){

	var suggestion_input = document.getElementById('suggestion_input');

	if(e.target.tagName === 'LI'){

		// SKIP THIS CODE, THE ERROR LIES BELOW
		var light_green = document.getElementById('activities').querySelector('#light_green');

		if(light_green){
			 light_green.style.backgroundColor="red";
			 light_green.id = "";
			 e.target.style.backgroundColor = '#0DFFB9';
		 	e.target.id = 'light_green';
		}else{
			e.target.style.backgroundColor = '#0DFFB9';
			e.target.id = 'light_green';
		}


		var para = document.getElementById('activities').querySelector('p');
		var display = para.style.display;

		// THIS IS WHERE THE ERROR OCCURS
		if(e.target.innerText === 'Your Suggestions'){


			if(display = 'inline-block'){
	            // This code will not work
				para.style.display = 'none';
	            suggestion_input.style.display = 'inline-block';
				console.log('works');
			}
		}else{
			if(display = 'none'){
            	suggestion_input.style.display = 'none';
				para.style.display = 'inline-block';
			}
		}
	}
});
  
