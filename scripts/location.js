export async function getLocationDetails(coords) {
    let jsonRes;
    await fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + coords[0] + '&lat=' + coords[1])
      .then(function(response) {
            jsonRes = response.json();    
        });
    return jsonRes;
}

export async function coordsToAddress(coords) {
    let address = "";

    try {
        await getLocationDetails(coords).then(
            function(jsonRes) {
                let r = jsonRes.address;
                let str = [r.country, r.city, r.town, r.building, r.postcode, r.house_number];
    
                for (let i = 0; i < str.length; i++) {
                    if (str[i] != undefined) {
                        if (i != 0) {
                            address = address + ', ' 
                        }
    
                        address = address + String(str[i]);
                    }
                }
            }
        );
    } catch (error) {
        console.log(error);
        return "Error";
    }

    return address;
}

