$(document).ready(function () {
	$(window).scroll(function () {
		if ($(window).scrollTop() >= 1) {
			$('header').addClass('header-sticky')
			$('.scroll-top').addClass('active')
		} else {
			$('header').removeClass('header-sticky')
			$('.scroll-top').removeClass('active')
		}
	});

	$('.scroll-top').click(function () {
		$('html, body').animate({ scrollTop: '0px' }, 300)
	})

	$('.hamburger').click(function(){
		$('.header-link').addClass('active')
	})

	$('.close-btn').click(function(){
		$('.header-link').removeClass('active')
	})
})