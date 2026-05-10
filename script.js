const apiKey = '46914473';
const movieInput = document.getElementById('movie-input');
const searchBtn = document.getElementById('search-btn');
const movieResult = document.getElementById('movie-result');

// event listener for search btn and movie input
searchBtn.addEventListener('click', () => {
    const movieName = movieInput.value.trim();

    if (movieName !== "") {
        getMovieData(movieName);
    } else {
        movieResult.innerHTML = `<h3 style="color:#f5c518;">Please enter a movie name!</h3>`;
    }
});

movieInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
});

// fetch the list of movies for the Grid
async function getMovieData(movie) {
    movieResult.innerHTML = `<h3 style="color:#b3b3b3;">Loading...</h3>`;

    try {
        // added '&type=movie' to stop unrelevent results
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movie}&type=movie`);
        const data = await response.json();

        if (data.Response === "True") {

            let output = '<div class="grid-container">';
            
            // Loop through sortedMovies array
            data.Search.forEach(item => {
                const poster = item.Poster !== "N/A" ? item.Poster : 'https://via.placeholder.com/150x220?text=No+Poster';
                
                output += `
                    <div class="grid-card" onclick="getMovieDetails('${item.imdbID}')">
                        <img src="${poster}" alt="Movie Poster">
                        <h3>${item.Title}</h3>
                        <p>${item.Year}</p>
                    </div>
                `;
            });
            
            output += '</div>';
            movieResult.innerHTML = output;
        } else {
            movieResult.innerHTML = `<h3 style="color: #f5c518;">${data.Error}</h3>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        movieResult.innerHTML = `<h3 style="color: #f5c518;">Something went wrong.</h3>`;
    }
}
async function getMovieDetails(id) {
    movieResult.innerHTML = `<h3 style="color:#b3b3b3;">Loading details...</h3>`;

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
        const data = await response.json();
    
        if (data.Response === "True") {
            // We use our original single-movie layout here, plus a "Back" button
            movieResult.innerHTML = `
                <button class="back-btn" onclick="getMovieData(document.getElementById('movie-input').value)">⬅ Back to Results</button>
                <div class="movie-card">
                    <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/250x350?text=No+Poster'}" alt="Movie Poster">
                    <h2>${data.Title}</h2>
                    <div class="movie-info">
                        <span>📅 ${data.Year}</span>
                        <span>⭐ ${data.imdbRating}</span>
                        <span>⏱️ ${data.Runtime}</span>
                    </div>
                    <p class="movie-plot">${data.Plot}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}
    
