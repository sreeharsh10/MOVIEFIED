async function searchMovie() {

  let name = document.getElementById("search").value;

  name = name.trim();

  if (name.length < 1) {
    document.getElementById("result").innerHTML =
      "Type movie name";
    return;
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(name)}`
  );

  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    document.getElementById("result").innerHTML =
      "Not found";
    return;
  }

  let html = "<h2>Results</h2>";

  data.results.forEach(movie => {

    const poster = movie.poster_path
      ? "https://image.tmdb.org/t/p/w200" + movie.poster_path
      : "";

    html += `

      <div class="movieItem"
      onclick="loadMovie(${movie.id})">

        <img src="${poster}">

        <p>${movie.title}</p>

      </div>

    `;

  });

  document.getElementById("result").innerHTML = html;

}



async function loadMovie(id) {

  const details = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  ).then(r => r.json());

  const credits = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
  ).then(r => r.json());

  const providers = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
  ).then(r => r.json());


  const poster =
    "https://image.tmdb.org/t/p/w500" + details.poster_path;

  const backdrop =
    "https://image.tmdb.org/t/p/original" + details.backdrop_path;


  let director = "Unknown";
  let cine = "Unknown";
  let music = "Unknown";

  credits.crew.forEach(p => {

    if (p.job === "Director")
      director = p.name;

    if (p.job === "Director of Photography")
      cine = p.name;

    if (p.job === "Original Music Composer")
      music = p.name;

  });


  let cast = credits.cast
    .slice(0,5)
    .map(c => c.name)
    .join(", ");


  let ott = "Not available";

  if (providers.results && providers.results.IN) {

    const p = providers.results.IN;

    if (p.flatrate && p.flatrate.length > 0)
      ott = p.flatrate[0].provider_name;

    else if (p.rent && p.rent.length > 0)
      ott = "Rent: " + p.rent[0].provider_name;

    else if (p.buy && p.buy.length > 0)
      ott = "Buy: " + p.buy[0].provider_name;

    else
      ott = "Theaters / Not streaming";

  }


  document.getElementById("result").innerHTML = `

  <div class="moviePage">

    <div class="backdrop"
    style="background-image:url('${backdrop}')">
    </div>

    <div class="movieContent">

      <img class="poster"
      src="${poster}">

      <div class="info">

        <h2>${details.title}</h2>

        <p>${details.overview}</p>

        <p><b>Release:</b> ${details.release_date}</p>

        <p><b>Director:</b> ${director}</p>

        <p><b>Cinematographer:</b> ${cine}</p>

        <p><b>Music Director:</b> ${music}</p>

        <p><b>Cast:</b> ${cast}</p>

        <p><b>OTT / Platform:</b> ${ott}</p>

      </div>

    </div>

  </div>

  `;

}