const update = document.querySelector('#update-button');
const deleteButton = document.querySelector("#delete-button");
const messageDiv = document.querySelector("#message");


update.addEventListener('click', () => {
	console.log('hellor');
	fetch('/quotes', {
		method: 'put',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify({
			name: 'Bran Stark',
			quote: 'I saw that coming ;). I AM THE KING'
		})
	}).then((res) => {
			if(res.ok) 
				return res.json();
		})
		.then((response)=>{
		  	window.location.reload(true);	
		});
});


deleteButton.addEventListener("click", (_) => {
  fetch("/quotes", {
    method: "delete",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Bran Stark'
    })
  })
  .then(res => {
      if (res.ok) return res.json()
    })
    .then((response) => {
      if(response === "No quote to delete"){ 
      	messageDiv.textContent = "Bran cannot be broken anymore!!!";
      }
      else{
    	  window.location.reload();
  		}
    })
});


