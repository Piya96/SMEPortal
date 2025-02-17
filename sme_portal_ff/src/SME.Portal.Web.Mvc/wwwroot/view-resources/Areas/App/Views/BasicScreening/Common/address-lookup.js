// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
//var addr = {

let fillInAddrComplete = null;

let auto_complete = null;

function setFillInAddrComplete(cb) {
    if (fillInAddrComplete == null) {
        fillInAddrComplete = cb;
    }
}

var autocomplete_user, autocomplete_owner, autocomplete_company;

	var componentForm = {
		street_number: 'short_name',
		route: 'long_name',
		locality: 'long_name',
		administrative_area_level_1: 'short_name',
		country: 'long_name',
		postal_code: 'short_name'
    };

function fillComponents(id, fn) {
    let place = fn.getPlace();
    $('#' + id).val(place.formatted_address);
}

function fillInAddress_user() {
    fillComponents('input-user-profile-registered-address', autocomplete_user);
}

function fillInAddress_owner() {
    fillComponents('input-owner-profile-registered-address', autocomplete_owner);
}

function fillInAddress_company() {
    fillComponents('input-company-profile-registered-address', autocomplete_company);
}

function initAutocomplete_user() {
    autocomplete_user = new google.maps.places.Autocomplete(document.getElementById('input-user-profile-registered-address'), { types: ['geocode'] });

    autocomplete_user.setFields(['address_components', 'formatted_address']);

    autocomplete_user.addListener('place_changed', fillInAddress_user);

    autocomplete_user.setComponentRestrictions({
        country: ['za']
    });
}

function initAutocomplete_owner() {
    autocomplete_owner = new google.maps.places.Autocomplete(document.getElementById('input-owner-profile-registered-address'), { types: ['geocode'] });

    autocomplete_owner.setFields(['formatted_address']);

    autocomplete_owner.addListener('place_changed', fillInAddress_owner);

    autocomplete_owner.setComponentRestrictions({
        country: ['za']
    });
}

function initAutocomplete() {
    autocomplete_company = new google.maps.places.Autocomplete(document.getElementById('input-company-profile-registered-address'), {types: ['geocode']});

    autocomplete_company.setFields(['address_components', 'formatted_address']);

    autocomplete_company.addListener('place_changed', fillInAddress_company);

    autocomplete_company.setComponentRestrictions({
        country : [ 'za' ]
    });

    //autocomplete_company;
}

const place_changed_event = new Event('place_changed');

function fillInAddress_company() {

        // * These fields are internal to the google API *
        // street_number
        // route
        // sublocality_level_2
        // locality
        // administrative_area_2
        // administrative_area_1
        // country
        // postal_code

    function getComponent(name, components, long = true) {
        for (let i = 0, m = components.length; i < m; i++) {
            let component = components[i];
            for (let j = 0, n = component.types.length; j < n; j++) {
                if (name == component.types[j]) {
                    return long == true ? component.long_name : component.short_name;
                }
            }
        }
        return '';
    }

    let place = autocomplete_company.getPlace();

    let components = {
        number: getComponent('street_number', place.address_components),
        street: getComponent('route', place.address_components),
        town: getComponent('locality', place.address_components),
        province: getComponent('administrative_area_level_1', place.address_components, false),
        code: getComponent('postal_code', place.address_components),
        country: getComponent('country', place.address_components)
    };


    let province = app.common.gmap.areaCodeToProvince(components.code);
    if (province != null) {
        components.province = province.key;
    } else if (components.province == 'KZN') {
        components.province = 'KZ';
    }

    if (components.number == '') {
        let addr = $('#input-company-profile-registered-address').val();
        let index = addr.indexOf(components.street);
        if (index != -1) {
            components.number = addr.slice(0, index);
        }
    }

    $('#input-company-profile-address-line1').val(components.number + ',' + components.street + ',' + components.town);
    $('#input-company-profile-address-line2').val(components.country + ',' + components.code + ',' + components.province);
    $('#input-company-profile-city').val(components.town);
    $('#input-company-profile-postal-code').val(components.code);

    if (fillInAddrComplete != null) {
        fillInAddrComplete(components);
    }
}
    
    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
	function geolocate() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var geolocation = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				var circle = new google.maps.Circle(
					{center: geolocation, radius: position.coords.accuracy
				});
				autocomplete.setBounds(circle.getBounds());
			});
		}
	}

