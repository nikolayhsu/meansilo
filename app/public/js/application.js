// application.js

$(function(){

	$(".jqslider").each(function(){
        $(this).slider({precision:8});
    });

	var mineCoords;
    
    $("#latitude").on('change',function(){ resetBounds(); });
    $("#longitude").on('change',function(){ resetBounds(); });

    $("#format").on('change',function(e){
      if ($(this).val() == "html") {
        $("#searchForm").attr('target',"_self");
      } else {
        $("#searchForm").attr('target',"_blank");
      }

    });

    var resetBounds = function () {

		var _latMinMax = $("#latitude").val().split(',');
		var _lonMinMax = $("#longitude").val().split(',');

		var _latMin = _latMinMax[0];
		var _latMax = _latMinMax[1];
		var _lonMin = _lonMinMax[0];
		var _lonMax = _lonMinMax[1];

		mineCoords = [
			new google.maps.LatLng(_latMin, _lonMin),
			new google.maps.LatLng(_latMin, _lonMax),
			new google.maps.LatLng(_latMax, _lonMax),
			new google.maps.LatLng(_latMax, _lonMin)
		];

		if (window.mineBox !== undefined) {
			window.mineBox.setMap(null);
		}

		// Construct the polygon.
		window.mineBox = new google.maps.Polygon({
			paths: mineCoords,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35
		});

		window.mineBox.setMap(window.map);

	}
	
	$('.multiselect').each(function(){
		var $ths = $(this);
		$ths.multiselect({buttonText: function(options, select) {
                if (options.length === 0) {
                    return $ths.attr('data-defaulttext');
                }
                else if (options.length > 4) {
                    return options.length + ' options selected';
                }
                 else {
                     var labels = [];
                     options.each(function() {
                         if ($(this).attr('label') !== undefined) {
                             labels.push($(this).attr('label'));
                         }
                         else {
                             labels.push($(this).html());
                         }
                     });
                     return labels.join(', ') + '';
                 }
            }
		}).multiselect('select' , $ths.attr('data-default'));
	});

});

var mapReLoaded = false;