(function ($) {
	$.fn.slideAround = function(options){
		var settings = $.extend({
				slideAroud: null,
				slides: null,
				currSlideNum: 0,
				auto: false,
				autoDelay: 5000,
				margin: 10,
				container: this,
				nextBtn: null,
				prevBtn: null,
				css: true,
				touch: true,
				infiniteLoop: true
			}, options),
			slideAroundWidth = settings.slideAround.outerWidth(),
			currSlide = settings.slides.eq((settings.currSlideNum)),
			slideWidth = settings.slides.outerWidth(true),
			totalWidth = slideWidth*settings.slides.length,
			adjustedMargin,
			prevSlide = currSlide.prev(),
			timeout,
			reverse = false;

		var init = function(){
			settings.container.width(totalWidth+slideAroundWidth+(settings.margin*2));

			adjustMarginFunc();

			setActions();

			if(settings.auto){
				setInterval(function(){
					if(settings.slides.length-1 == settings.currSlideNum){
						reverse = true;
					}else if(settings.currSlideNum == 0){
						reverse = false;
					}

					if(reverse){
						goToSlide(0);
					}else{
						goToSlide(settings.currSlideNum+1);
					}
				}, settings.autoDelay);
			}
			
		},
		adjustMarginFunc = function(){
			adjustedMargin = (settings.slideAround.offset().left)+slideAroundWidth;

			if(settings.css && !$('.lt-ie9').length){
				if(settings.currSlideNum == 0){
					settings.container.css({'margin-left': adjustedMargin})
				}else{
					adjustedMargin = adjustedMargin-(slideWidth*settings.currSlideNum);
					adjustedMargin = adjustedMargin-slideAroundWidth;
					adjustedMargin = adjustedMargin-settings.margin;
					currSlide.css({'margin-left': slideAroundWidth+(settings.margin*2)})
					settings.container.css({'margin-left': adjustedMargin})
				}
			}else{
				if(settings.currSlideNum == 0){
					settings.container.animate({'margin-left': adjustedMargin})
				}else{
					adjustedMargin = adjustedMargin-(slideWidth*settings.currSlideNum);
					adjustedMargin = adjustedMargin-slideAroundWidth;
					adjustedMargin = adjustedMargin-settings.margin;
					currSlide.css({'margin-left': slideAroundWidth+(settings.margin*2)})
					currSlide.animate({'margin-left': slideAroundWidth+(settings.margin*2)})
					settings.container.animate({'margin-left': adjustedMargin})
				}
			}

			currSlide.addClass('is-active');
		},
		setActions = function(){
			settings.nextBtn.on('click', function(e){
				if(settings.slides.length-1 > settings.currSlideNum){
					goToSlide(settings.currSlideNum+1);
				}else if(settings.slides.length-1 == settings.currSlideNum){
					if(settings.infiniteLoop){
						goToSlide(0);
					}
				}

				e.preventDefault();
			});

			settings.prevBtn.on('click', function(e){
				if(settings.currSlideNum > 0){
					goToSlide(settings.currSlideNum-1);
				}else if(settings.currSlideNum == 0){
					if(settings.infiniteLoop){
						goToSlide(settings.slides.length-1);
					}
				}
				e.preventDefault();
			});
			if(settings.touch){
				settings.container.touchwipe({
				     wipeLeft: function() { goToSlide(settings.currSlideNum+1); },
				     wipeRight: function() { goToSlide(settings.currSlideNum-1); },
				     preventDefaultEvents: true
				});
			}
			$(window).on('resize', function(){
				clearTimeout(timeout);
				timeout = setTimeout(function(){
					adjustMarginFunc();
				}, 200);
			})
		},
		setCurrentSlide = function(slideNum){
			// resets the current slide
			currSlide.removeAttr('style');
			currSlide.removeClass('is-active');
			prevSlide.removeAttr('style');

			//sets the new current slide
			currSlide = settings.slides.eq(slideNum);
			prevSlide = currSlide.prev();
		},
		goToSlide = function(slideNum){
			settings.currSlideNum = slideNum;
			setCurrentSlide(slideNum);
			adjustMarginFunc();
		}


		// makes it a bit smoother
		setTimeout(function(){
			init();
		}, 500)
		

		return this;
			
	}
})(jQuery)