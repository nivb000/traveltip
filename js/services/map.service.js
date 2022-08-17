import { locService  } from "./loc.service.js"

const API_KEY = 'AIzaSyA36b7We_tjp91ABvxos4yefbmxkgPNUIM'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    searchLocation
}


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
            document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
        })
        .then(() => {
            gMap.addListener("click", (mapsMouseEvent) => {
                let marker = new google.maps.Marker({
                    position: mapsMouseEvent.latLng,
                    map: gMap
                })
                onAddLocation(marker.position)
            });
        })
}


function onAddLocation(pos) {
    const askToAdd = confirm("Are you want to add this location? ")
    if(!askToAdd) return
    const LocationName = prompt("Enter The Location Name")
    locService.createLocation(LocationName,pos.lat(),pos.lng())
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function searchLocation(value) {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${API_KEY}
    `
    const prm = fetch(URL)
    .then(res => res.json())
    .then((res) =>  res.results[0])
    .then(address => ({
        name: address.formatted_address,
        position:{lat: address.geometry.location.lat, lng: address.geometry.location.lng}
    }))
    return prm
}