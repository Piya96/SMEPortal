// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
//var addr = {

    let fillInAddrComplete = null;

    function setFillInAddrComplete(cb) {
        if (fillInAddrComplete == null) {
            fillInAddrComplete = cb;
        }
    }

	var placeSearch, autocomplete;

	var componentForm = {
		street_number: 'short_name',
		route: 'long_name',
		locality: 'long_name',
		administrative_area_level_1: 'short_name',
		country: 'long_name',
		postal_code: 'short_name'
    };

function fillInAddress_user() {

    function fillComponents(place) {
        let components = {
            number: null,
            street: null,
            town: null,
            province: null,
            code: null,
            country: null
        };
        for (let i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            switch (addressType) {
                case 'street_number':
                    components.number = place.address_components[i][componentForm[addressType]];
                    break;

                case 'route':
                    components.street = place.address_components[i][componentForm[addressType]];
                    break;

                case 'locality':
                    components.town = place.address_components[i][componentForm[addressType]];
                    break;

                case 'administrative_area_level_1':
                    components.province = place.address_components[i][componentForm[addressType]];
                    break;

                case 'postal_code':
                    components.code = place.address_components[i][componentForm[addressType]];
                    break;

                case 'country':
                    components.country = place.address_components[i][componentForm[addressType]];
                    break;
            }
        }
        return components;
    }

    //let place = autocomplete.getPlace();
    //if (place.hasOwnProperty('address_components') == false) {
    //    return;
    //}
    //
    //for (var component in componentForm) {
    //    let elem = document.getElementById(component);
    //    if (elem != null) {
    //        elem.value = '';
    //        elem.disabled = false;
    //    }
    //}
    //
    //let addressComponents = fillComponents(place);

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.

    //let addr1 = '';
    //for (let i = 0; i < place.address_components.length; i++) {
    //    var addressType = place.address_components[i].types[0];
    //    if (componentForm[addressType]) {
    //        var val = place.address_components[i][componentForm[addressType]];
    //        addr1 = addr1.concat(val + ', ');
    //        let elem = document.getElementById(addressType);
    //        if (elem != null) {
    //            elem.value = val;
    //        }
    //    }
    //}

    //let elem1 = document.getElementById('addr1');
    //elem1.value = place.address_components[0].long_name + ', ' + place.address_components[1].long_name;
    //let elem2 = document.getElementById('addr2');
    //elem2.value = place.address_components[2].long_name + ', ' + place.address_components[3].long_name;
}


function initAutocomplete_user() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('id-input-user-profile-registered-address'), { types: ['geocode'] });

    autocomplete.setFields(['address_component']);

    autocomplete.addListener('place_changed', fillInAddress_user);

    autocomplete.setComponentRestrictions({
        country: ['za']
    });
}

	function initAutocomplete() {
		autocomplete = new google.maps.places.Autocomplete(document.getElementById('id-registered-address'), {types: ['geocode']});

		autocomplete.setFields(['address_component']);
    
        autocomplete.addListener('place_changed', fillInAddress);

        autocomplete.setComponentRestrictions({
            country : [ 'za' ]
        });
	}
    
function fillInAddress() {

            // * These fields are internal to the google API *
            // street_number
            // route
            // sublocality_level_2
            // locality
            // administrative_area_2
            // administrative_area_1
            // country
            // postal_code
            function fillComponents(place) {
                let components = {
                    number: null,
                    street: null,
                    town: null,
                    province: null,
                    code: null,
                    country: null
                };
                for (let i = 0; i < place.address_components.length; i++) {
                    var addressType = place.address_components[i].types[0];
                    // TODO: Function for this!!!
                    switch (addressType) {
                        case 'street_number':
                            components.number = place.address_components[i][componentForm[addressType]];
                            break;

                        case 'route':
                            components.street = place.address_components[i][componentForm[addressType]];
                            break;

                        case 'locality':
                            components.town = place.address_components[i][componentForm[addressType]];
                            break;

                        case 'administrative_area_level_1':
                            components.province = place.address_components[i][componentForm[addressType]];
                            break;

                        case 'postal_code':
                            components.code = place.address_components[i][componentForm[addressType]];
                            break;

                        case 'country':
                            components.country = place.address_components[i][componentForm[addressType]];
                            break;
                    }
                }
                return components;
            }

		let place = autocomplete.getPlace();
		if(place.hasOwnProperty('address_components') == false) {
			return;
		}
		
		for (var component in componentForm) {
			let elem = document.getElementById(component);
			if(elem != null) {
				elem.value = '';
				elem.disabled = false;
			}
		}

        let addressComponents = fillComponents(place);

        // Get each component of the address from the place details,
        // and then fill-in the corresponding field on the form.
        let addr1 = '';
        for (let i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                addr1 = addr1.concat(val + ', ');
                let elem = document.getElementById(addressType);
                if(elem != null) {
                    elem.value= val;
                }
            }
        }

		let elem1 = document.getElementById('addr1');
		elem1.value = place.address_components[0].long_name + ', ' + place.address_components[1].long_name;
		let elem2 = document.getElementById('addr2');
		elem2.value = place.address_components[2].long_name + ', ' + place.address_components[3].long_name;

        if (fillInAddrComplete != null) {
            fillInAddrComplete(addressComponents);
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
//};
