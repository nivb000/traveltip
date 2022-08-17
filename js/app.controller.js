import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

var gGlobeIdx = 1

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc
window.onSearch = onSearch

window.locationText = locationText

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    onGetLocs()

    // renderGlobe()
    setInterval(renderGlobe, 750)
}

function onSearch(ev) {
    ev.preventDefault()
    const elInput = document.querySelector(".search-bar").value
    mapService.searchLocation(elInput)
        .then(location => {
            locService.createLocation(location.name, location.position.lat, location.position.lng),
            mapService.panTo(location.position.lat, location.position.lng)
            locationText(location.position.lat, location.position.lng)
            onGetLocs()
        })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}
function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onDeleteLoc(id) {
    locService.deleteLoc(id)
    onGetLocs()
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)

            let strHTML = locs.map(loc => `
            <tr>
                <td>${loc.id}</td>
                <td>${loc.name}</td>
                <td>${new Date(loc.createdAt)}</td>
                <td>lat: ${loc.pos.lat},lng: ${loc.pos.lng}</td>
                <td>
                    <button class="btn-action" onclick="onPanTo(${loc.pos.lat},${loc.pos.lng})">Go</button>
                    <button class="btn-action" onclick="onDeleteLoc('${loc.id}')">Delete</button>
                </td>
            </tr>
            `)
            document.querySelector(".list-locations").innerHTML = strHTML.join("")
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            console.log('User position is:', pos.coords)
            locationText(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
// onPanTo(lat,lng)
function onPanTo(lat, lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
    locationText(lat, lng)
    mapService.addMarker({ lat: lat, lng: lng })
}

// Change The P To the locatino
function locationText(lat, lng) {
    let txt = `Location Lat: ${lat} Lng: ${lng}`
    document.querySelector(".location-line").innerText = txt
}

function renderGlobe() {
    const globes = ['🌍', '🌎', '🌏']
    var currGlobe = globes[gGlobeIdx]
    const elGlobe = document.querySelector('.globe')
    elGlobe.innerHTML = currGlobe
    gGlobeIdx++
    if (gGlobeIdx === 3) gGlobeIdx = 0
}