import { storage } from "./storage.service.js";

export const locService = {
    getLocs,
    createLocations,
    createLocation,
    deleteLoc
}

const locs = storage.load('locationsDB') || []

function deleteLoc(id) {
    const deletedLoc = locs.findIndex(loc => loc.id === id)
    locs.splice(deletedLoc, 1)
    storage.save('locationsDB', locs)
}

//this fucntion just to work with something
function createLocations() {
    const locs = storage.load('locationsDB')
    if(!locs || locs.length < 1){
        locs.push(createLocation('Greatplace', 32.047104, 34.832384))
    }
}

function createLocation(name, lat, lng) {
    const location = {
        id: makeid(5),
        name,
        createdAt: Date.now(),
        pos: {
            lat: lat.toFixed(2),
            lng: lng.toFixed(2)
        }
    }
    locs.push(location)
    storage.save('locationsDB', locs)
}

//To Get the locations
function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 1000)
    })
}


// GENERATE RANDOM ID
const makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}