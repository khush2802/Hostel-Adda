
	mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: "map",
         style:"mapbox://styles/mapbox/streets-v12",
        // center:coordinates, 
        center:listing.geometry.coordinates, 
        zoom: 8,
    });



    const marker= new mapboxgl.Marker({color:"red"})
    // .setLngLat(coordinates)
    .setLngLat(listing.geometry.coordinates)

    .setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h4>${listing.title}</h4>`
    ))
    .addTo(map);
