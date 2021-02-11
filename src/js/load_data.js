// PRODUCTS SECTION (ЗАГРУЗКА РЫБЫ – можно удалить)
$(() => {
    fill_authors();
});

function fill_authors(){
	$.ajax({
		url: "/data/authors.json",
		dataType: "json",
		success: response => {
			authors = response
		
			updateAuthorPopup();
		},
		error: error => {
			console.error(error);
		}
	})
}