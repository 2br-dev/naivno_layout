var authors = [];
var heroSlider;
var openedAuthor;
var materialbox;

var imageBeforeClose;

$(() => {
	$('p, li, ol').hyphenate();
	$('body').on('click', '.author', openAuthor);
	$('body').on('click', '.author-expanded .close', closeAuthor);
	$('body').on('click', '.folder-trigger', toggleFolder);
	$('body').on('click', '.tree-trigger', toggleTree);
	$('body').on('click', clickOutside);
	$(window).on('resize', updateAuthorPopup);
	$(window).on('scroll', updateFloatingCart);
	$('html, body').on('mousewheel', updateTreeTrigger);
	$('body').on('click', '.dropdown-container .current', openDropdown);
	$('body').on('click', '.dropdown-container .popup a', setCurrent);
	$('body').on('click', 'a.color', setColor);
	$('body').on('click', '.modal-trigger', openModal);
	$('body').on('click', '.modal-close', closeModal);
	$('body').on('change', '[name="address"]', updateAddressField);
	$('body').on('change', '[name="delivery"]', updateAddressList);
	$('body').on('click', '.history>tbody>tr', expandDetails);
	$('body').on('change', '.toggle-group', toggleGroup);

	loadImages();

	initSlider();
	$('.sidenav').sidenav();
	var elems = document.querySelectorAll('.materialboxed');
	var options = {
		onOpenEnd: (e) => {
			imageBeforeClose = $(e).css('background-image');
		},
		onCloseEnd: (e) => {
			loadImages();
			$(e).css({
				backgroundImage: imageBeforeClose
			})
		}
	}
	materialbox = M.Materialbox.init(elems, options);
	var instance = M.Tabs.init(document.querySelectorAll('.tabs'), {

	});

});

// MISC FUNCTIONS ======================================
function updateFloatingCart(){
    if($('html, body').scrollTop() >= 50){
        $('.floating-cart').addClass('shown');
    }else{
        $('.floating-cart').removeClass('shown');
    }
}
function toggleGroup(e){
	var group = $(this).data('target');
	$('[data-group="'+group+'"]').toggleClass('visible');
}
function expandDetails(e){

	var path = e.originalEvent.path;
	var links = $(path).filter((index, el) => {
		return el.tagName == 'A'
	});

	if(!links.length){

		e.preventDefault();
		var already = $(this).next().find('.subtable-wrapper').css('display') == 'block';
		$('.subtable-wrapper').slideUp('fast');
		if(!already){
			$(this).next().find('.subtable-wrapper').slideDown('fast');
		}
	}

}
function updateAddressList(e){
	if($(this).hasClass('need-address')){
		$('.address-list').removeClass('hidden');
	}else{
		$('.address-list').addClass('hidden');
	}
}
function updateAddressField(e){
	if($(this).val() == 'user-address'){
		$('#user-address').removeClass('hidden');
	}else{
		$('#user-address').addClass('hidden');
	}
}
function openModal(e){
	$('.modal').removeClass('opened');
	var modal = $(this).attr('href');
	$(modal).addClass('opened');
}
function closeModal(e){
	if(e){
		e.preventDefault();
	}
	$('.modal').removeClass('opened');
}
function loadImages(e){
	$('.lazy-image').lazy();
}
function setColor(e){
	e.preventDefault();
	$('.color').removeClass('current');
	$(this).addClass('current');
}
function setCurrent(e){
	e.preventDefault();
	var currentVal = $(this).text();

	var parent = $(this).parents('.dropdown-container');

	parent.find('.current').text(currentVal);
	parent.find('.popup').removeClass('open');
	
}
function clickOutside(e){
	var path = e.originalEvent.path;

	if(!e.originalEvent){
		return;
	}

	// Close all dropdowns
	var dropdowns = path.filter(selector => {
		return $(selector).hasClass('dropdown-container');
	});

	if(dropdowns.length == 0){
		$('.dropdown-container .popup').removeClass('open');
	}
}
function openDropdown(e){
	e.preventDefault();
	$(this).parents('.dropdown-container').find('.popup').toggleClass('open');
}
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
	heroSlider = new Swiper('.swiper-container', {});
	heroSlider.on('slideChange', () => {
		loadImages();
	})
}
function toggleTree(e){
	e.preventDefault();

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
	$('.author-expanded .description').html(author.description != "" ? author.description : "Описание пока отсутствует");
	$('.author-expanded .profile').attr('href', author.about_link);
	if(author.gallery_link){
		  $('.author-expanded .gallery').removeClass('hidden').attr('href', author.gallery_link);
	  }else {
		  $('.author-expanded .gallery').addClass('hidden');
	  }
  
	$('.author-expanded .name').text(author.name);
	$('.author-expanded').addClass('open');
	updateAuthorPopup();
  }
