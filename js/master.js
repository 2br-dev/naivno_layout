var authors = [];
var heroSlider;
var openedAuthor;

$(() => {
	$('p, li, ol').hyphenate();
	$('body').on('click', '.author', openAuthor);
	$('body').on('click', '.author-expanded .close', closeAuthor);
	$('body').on('click', '.folder-trigger', toggleFolder);
	$('body').on('click', '.tree-trigger', toggleTree);
	$(window).on('resize', updateAuthorPopup);
	$('html, body').on('mousewheel', updateTreeTrigger);

	fill_authors();
	fillProducts();

	initSlider();
	$('.sidenav').sidenav();
});


// AUTHORS SECTION ========================================
function closeAuthor(e){
	e.preventDefault();
	$('.author-expanded').removeClass('open');
}
function updateAuthorPopup(){

	if(!$('.author-expanded').length)
		return;

	var anchorId = $('.author-expanded').data('anchor');
	var anchoredAuthor = anchorId ? $('.author[data-id="'+anchorId+'"]')[0] : $('.author[data-id]')[0];
	
	var top = $(anchoredAuthor).position().top + 10;
	var anchoredHeight = $(anchoredAuthor).outerHeight();
	var height = $(window).outerWidth() >= 600 ? anchoredHeight : (anchoredHeight * 2) + 20;
	if($(window).outerWidth() <= 400){
		height = anchoredHeight;
	}
	var width = $(anchoredAuthor).outerWidth();

	var bottom = top + height;
	var wrapper_bottom = $('#authors-container').position().top + $('#authors-container').outerHeight();

	if(bottom > wrapper_bottom){
		top -= (anchoredHeight + 20);
	}

	var photo_width = $(window).outerWidth() >= 600 ? (width) + 'px' : '100%';
	var info_height = anchoredHeight - 80;

	$('.info .description').css({
		maxHeight: info_height
	})

	$('.author-expanded').css({
		height: height+'px',
		top: top+'px'
	});


	$('.author-expanded .photo').css({
		width: photo_width,
		height: anchoredHeight + 'px'
	})


}
function openAuthor(e, author2open = null){

	var id = $(this).data('id');
	
	var author = author2open == null ? authors.filter(author => {
		return author.id == id;
	})[0] : author2open;

	openedAuthor = author;

	var top = $('.author[data-id="'+openedAuthor.id+'"]').offset().top;
	var height = $('.author[data-id="'+openedAuthor.id+'"]').outerHeight();
	$('.author-expanded').data('anchor', id);

	if(!$('.author-expanded').hasClass('open')){
		setData(openedAuthor);
	}else{
		$('.author-expanded').removeClass('open');
		setTimeout(() => {
			setData(openedAuthor);
		}, 220);
	}
}
function setData(author){
	$('.author-expanded .photo').css({
		backgroundImage: 'url('+author.img+')'
	});
	$('.author-expanded .description').text(author.description != "" ? author.description : "Описание пока отсутствует");
	$('.author-expanded .profile').attr('href', author.about_link);
	$('.author-expanded .gallery').attr('href', author.gallery_link);
	$('.author-expanded .name').text(author.name);
	$('.author-expanded').addClass('open');
	updateAuthorPopup();
}
function fill_authors(){
	$.ajax({
		url: "/data/authors.json",
		dataType: "json",
		success: response => {
			authors = response.authors
			
			$(authors).each((index, author) => {
				author = $(`<div class="lazy-image author waves-effect waves-light" data-src="`+author.img+`" data-id="`+author.id+`"></div>`);
				$('#authors-container').append(author);
			});

			fillImages();
			updateAuthorPopup();
		},
		error: error => {
			console.error(error);
		}
	})
}

// PRODUCTS SECTION (ЗАГРУЗКА РЫБЫ – можно удалить)
function fillProducts(){
	$.ajax({
		url: "/data/products.json",
		dataType: "json",
		success: response => {

			var tpl = `
			<div class="col xl3 l4 m6 s12">
				<div class="card hoverable" data-id="[+0+]">
					<div class="card-image">
						<div class="lazy-image product-image" data-src="[+1+]">
							<a href="[+2+]" class="waves-effect waves-light">На страницу<br>товара</a>
						</div>
					</div>
					<div class="card-content">
						<div class="card-header">[+3+]</div>
					</div>
					<div class="card-footer">
						<span class="price">[+4+]</span>
						<a href="">
							<img src="/img/cart_accent.svg">
						</a>
					</div>
				</div>
			</div>`;

			$(response.products).each((index, product) => {

				var card = tpl
					.replaceAll("[+0+]", product.id)
					.replaceAll("[+1+]", product.image)
					.replaceAll("[+2+]", product.url)
					.replaceAll("[+3+]", product.description)
					.replaceAll("[+4+]", product.price);
				
				$('#products-wrapper').append(card);
				fillImages();
			});
		},
		error: error => {
			console.log(error);
		}
	})
}

// MISC FUNCTIONS ======================================
function updateTreeTrigger(e){
	var delta = e.originalEvent.deltaY;

	var tree_wrapper = e.originalEvent.path.filter((selector) => {
		return $(selector).hasClass('tree-wrapper');
	})

	if(!tree_wrapper.length){
		if(delta > 0){
			$('.tree-wrapper').addClass('sticky-hidden');
		}else{
			$('.tree-wrapper').removeClass('sticky-hidden');
		}
	}
}
function initSlider(){
	heroSlider = new Swiper('.swiper-container', {

	});
}
function fillImages(){
	$('.lazy-image').each((index, el) => {
		var src = $(el).data('src');

		if(src){
			$(el).css({
				backgroundImage: 'url('+src+')'
			})
		}
	})
}
function toggleTree(e){
	e?.preventDefault();

	$(this).next().toggleClass('expanded');
}
function toggleFolder(e){
	e.preventDefault();

	var expandedClass = 'open';
	var ul = $(this).parent().find('ul');
	var already = ul.hasClass(expandedClass);
	var newClass = already ? '' : expandedClass
	$('.tree-wrapper ul').removeClass(expandedClass);
	ul.addClass(newClass);
	
	
}