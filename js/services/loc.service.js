export const locService = {
    getLocs,
    createLocations,
    createLocation,
    deleteLoc
}

const locs = []

function deleteLoc(id) {
    console.log(id);
    const deletedLoc = locs.findIndex(loc => loc.id === id)
    console.log(deletedLoc);
    locs.splice(deletedLoc, 1)
    //TODO Resave on local storage the locs array
}

//this fucntion just to work with something
function createLocations() {
    createLocation('Greatplace', 32.047104, 34.832384)
    createLocation('Neveragain', 32.047201, 34.832581)
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