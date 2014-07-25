/*
 * Fuel UX Datepicker
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2014 ExactTarget
 * Licensed under the MIT license.
 */

// -- BEGIN UMD WRAPPER PREFACE --

// For more information on UMD visit:
// https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// if AMD loader is available, register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// OR use browser globals if AMD is not present
		factory(jQuery);
	}
}(function ($) {
	// -- END UMD WRAPPER PREFACE --

	// -- BEGIN MODULE CODE HERE --

	var old    = $.fn.datepicker;
	var moment = false;

	// only load moment if it's there. otherwise we'll look for it in window.moment
	// you need to make sure moment is loaded before the rest of this module

	// check if AMD is available
	if(typeof define === 'function' && define.amd) {
		require(['moment'], function( amdMoment ) {
			moment = amdMoment;
		}, function( err ) {
			var failedId = err.requireModules && err.requireModules[0];
			if (failedId === 'moment') {
				// do nothing cause that's the point of progressive enhancement
				if( typeof window.console !== 'undefined' ) {
					if( window.navigator.userAgent.search( 'PhantomJS' ) < 0 ) {
						// don't show this in phantomjs tests
						//window.console.log( "Don't worry if you're seeing a 404 that's looking for moment.js. The Fuel UX Datepicker is trying to use moment.js to give you extra features." );
						//window.console.log( "Checkout the Fuel UX docs (http://exacttarget.github.io/fuelux/#datepicker) to see how to integrate moment.js for more features" );
					}
				}
			}
		});
	}

	// DATEPICKER CONSTRUCTOR AND PROTOTYPE

	var Datepicker = function (element, options) {
		this.$element = $(element);

		this.options = $.extend(true, {}, $.fn.datepicker.defaults, options);

		this.$days = this.$element.find('.datepicker-calendar-days');
		this.$headerCenter = this.$element.find('.datepicker-calendar-header .center');

		this.renderMonth(this.options.date);
	};

	Datepicker.prototype = {

		constructor: Datepicker,

		renderMonth: function(date){
			var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
			var lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
			var lastMonthDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
			var $month = this.$headerCenter.find('.month');
			var month = date.getMonth();
			var stage = 0;
			var $tbody = this.$days.find('tbody');
			var year = date.getFullYear();
			var curDate, i, j, $td, $tr;

			$month.find('.current').removeClass('current');
			$month.find('li[data-month="' + month + '"]').addClass('current');
			this.$headerCenter.find('.year').text(year);
			this.$headerCenter.find('a').attr({
				'data-month': month,
				'data-year': year
			});

			$tbody.empty();
			curDate = lastMonthDate - firstDay + 1;
			for(i=0; i<5; i++){
				$tr = $('<tr></tr>');
				for(j=0; j<7; j++){
					$td = $('<td><span><a href="#">' + curDate + '</a></span></td>');
					if(stage===0){
						$td.addClass('last-month');
					}else if(stage===2){
						$td.addClass('next-month');
					}

					curDate++;
					if(stage===0 && curDate>lastMonthDate){
						curDate = 1;
						stage = 1;
					}else if(stage===1 && curDate>lastDate){
						curDate = 1;
						stage = 2;
					}

					$tr.append($td);
				}
				$tbody.append($tr);
			}
		}

	};


	// DATEPICKER PLUGIN DEFINITION

	$.fn.datepicker = function (option) {
		var args = Array.prototype.slice.call( arguments, 1 );
		var methodReturn;

		var $set = this.each(function () {
			var $this   = $( this );
			var data    = $this.data( 'datepicker' );
			var options = typeof option === 'object' && option;

			if( !data ) $this.data('datepicker', (data = new Datepicker( this, options ) ) );
			if( typeof option === 'string' ) methodReturn = data[ option ].apply( data, args );
		});

		return ( methodReturn === undefined ) ? $set : methodReturn;
	};

	$.fn.datepicker.defaults = {
		date: new Date()
	};

	$.fn.datepicker.Constructor = Datepicker;

	$.fn.datepicker.noConflict = function () {
		$.fn.datepicker = old;
		return this;
	};

	// DATA-API

	$(document).on('mousedown.fu.datepicker.data-api', '[data-initialize=datepicker]', function (e) {
		var $control = $(e.target).closest('.datepicker');
		if(!$control.data('datepicker')) {
			$control.datepicker($control.data());
		}
	});

	$(function () {
		$('[data-initialize=datepicker]').each(function () {
			var $this = $(this);
			if($this.data('datepicker')){ return; }
			$this.datepicker($this.data());
		});
	});

// -- BEGIN UMD WRAPPER AFTERWORD --
}));
// -- END UMD WRAPPER AFTERWORD --
