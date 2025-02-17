(function(){

	let price = $('.pricing2 .price_val').text();

	$('.monthly-btn').on('click', function(){
		$(this).addClass('active');
		$(this).removeClass('disable');
		$('.annual-btn').addClass('disable');
		$('.annual-btn').removeClass('active');
		$('.pricing2 .pricing-head .price').text(price);
		$('.discount-message').removeClass('active');
        $('.pricing2 .pricing-head .indicator').text('Monthly');

        $('#annual-upgrade-btn').hide();
        $('#monthly-upgrade-btn').show();
	});

	$('.annual-btn').on('click', function(){
		$(this).addClass('active');
		$(this).removeClass('disable');
		$('.monthly-btn').addClass('disable');
		$('.monthly-btn').removeClass('active');
		$('.discount-message').addClass('active');
		$('.pricing2 .pricing-head .indicator').text('Annually');

		price = parseInt(price);
		let annual_val = (price * 12) - 300; 
        $('.pricing2 .pricing-head .price').text(annual_val);

        $('#monthly-upgrade-btn').hide();
        $('#annual-upgrade-btn').show();
	});

	$('.annual-btn').click();
	
})();
