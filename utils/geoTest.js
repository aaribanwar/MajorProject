const fetch = require("node-fetch").default;

 module.exports.geocodeLocation = async (address) => {
  const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${process.env.GEOCODE_API_KEY}`;
  
  const res = await fetch(url);
  const data = await res.json();

  if (!data.length) return null;

  return {
    type: "Point",
    coordinates: [Number(data[0].lon), Number(data[0].lat)]
  };
}


