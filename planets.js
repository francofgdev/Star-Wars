let currentPageUrl = 'https://swapi.dev/api/planets/'

window.onload = async () => {
    try {
        await loadPlanets(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)
};

async function loadPlanets(url) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''; //Limpa os resultados anteriores

    try {

        const response = await fetch(url);
        const responseJson = await response.json();

        responseJson.results.forEach(async (planets) => {
            const card = document.createElement("div")
            let urlImg = `https://starwars-visualguide.com/assets/img/planets/${planets.url.replace(/\D/g, "")}.jpg`;
            const response = await fetch(urlImg)
            if (response.status == '404') {
                urlImg = './assets/No-Image-Placeholder.svg.png'
            }
            card.style.backgroundImage = `url('${urlImg}')`
            card.className = "cards"

            const planetNameBg = document.createElement("div")
            planetNameBg.className = "planet-name-bg"

            const planetName = document.createElement("spam")
            planetName.className = "planet-name"
            planetName.innerText = `${planets.name}`

            planetNameBg.appendChild(planetName)
            card.appendChild(planetNameBg)

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = ''

                const planetImage = document.createElement("div")
                planetImage.style.backgroundImage = `url('${urlImg}')`
                planetImage.className = "planet-image"

                const name = document.createElement("span");
                name.className = "planet-details";
                name.innerText = `Nome: ${planets.name}`;

                const rotation_period = document.createElement("span");
                rotation_period.className = "planet-details";
                rotation_period.innerText = `rotacao: ${convertRotation(planets.rotation_period)}`;

                const diameter = document.createElement("span");
                diameter.className = "planet-details";
                diameter.innerText = `diamentro: ${planets.diameter}`;

                const climate = document.createElement("span");
                climate.className = "planet-details";
                climate.innerText = `Clima: ${convertClimate(planets.climate)}`;

                const population = document.createElement("span");
                population.className = "planet-details";
                population.innerText = `populacao: ${convertPopulation(planets.population)}`;

                modalContent.appendChild(planetImage);
                modalContent.appendChild(name);
                modalContent.appendChild(rotation_period);
                modalContent.appendChild(diameter);
                modalContent.appendChild(climate);
                modalContent.appendChild(population);
            }

            mainContent.appendChild(card)
        });

        const nextButton = document.getElementById("next-button")
        const backButton = document.getElementById("back-button")

        nextButton.disabled = !responseJson.next
        backButton.disabled = !responseJson.previous

        backButton.style.visibility = responseJson.previous ? "visible" : "hidden"

        currentPageUrl = url

    } catch (error) {
        console.log(error)
        alert('Erro ao carregar personagens')
    }
}

async function loadNextPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadPlanets(responseJson.next)

    } catch (error) {
        console.log(error)
        alert('erro ao carregar próxima página')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
        const response = await fetch(currentPageUrl)
        const responseJson = await response.json()

        await loadPlanets(responseJson.previous)

    } catch (error) {
        console.log(error)
        alert('erro ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

function convertClimate(climate) {
    const clima = {
        arid: "arido",
        temperate: "termperado",
        tropical: "tropical",
        frozen: "congelado",
        murky: "escuro",

    };

    return clima[climate.toLowerCase()] || climate;
}

function convertPopulation(population) {
    const populacao = {
        Number: "",
        unknown: "desconhecida",
    };

    return populacao[population.toLowerCase()] || population;
}

function convertRotation(rotationPeriod) {
    if (rotationPeriod === "") {
        return Number;
    }

}