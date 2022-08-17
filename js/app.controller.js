import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

var gGlobeIdx = 1

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onDeleteLoc = onDeleteLoc

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    locService.createLocations()

    // renderGlobe()
    setInterval(renderGlobe, 750)
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
                <td>${new Date(loc.createdAt).toLocaleString()}</td>
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
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
// onPanTo(lat,lng)
function onPanTo(lat, lng) {
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
    mapService.addMarker({lat: lat,lng: lng})
}

function renderGlobe() {
    const globes = ['🌍', '🌎', '🌏']
    var currGlobe = globes[gGlobeIdx]
    const elGlobe = document.querySelector('.globe')
    elGlobe.innerHTML = currGlobe
    gGlobeIdx++
    if (gGlobeIdx === 3) gGlobeIdx = 0
}