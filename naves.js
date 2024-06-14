let currentPageUrl = 'https://swapi.dev/api/vehicles/'

window.onload = async () => {
    try {
        await loadVehicles(currentPageUrl);
    } catch (error) {
        console.log(error);
        alert('Erro ao carregar cards');
    }

    const nextButton = document.getElementById('next-button')
    const backButton = document.getElementById('back-button')

    nextButton.addEventListener('click', loadNextPage)
    backButton.addEventListener('click', loadPreviousPage)
};

async function loadVehicles(url) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = ''; //Limpa os resultados anteriores

    try {

        const response = await fetch(url);
        const responseJson = await response.json(); 

        responseJson.results.forEach(async (vehicles) => {
            const card = document.createElement("div")
            let urlImg = `https://starwars-visualguide.com/assets/img/vehicles/${vehicles.url.replace(/\D/g, "")}.jpg`;
            const response = await fetch(urlImg)
            if (response.status == '404') {
                urlImg = './assets/No-Image-Placeholder.svg.png'
            }
            card.style.backgroundImage = `url('${urlImg}')`
            card.className = "cards"

            const vehiclesNameBg = document.createElement("div")
            vehiclesNameBg.className = "vehicles-name-bg"

            const vehiclesName = document.createElement("spam")
            vehiclesName.className = "vehicles-name"
            vehiclesName.innerText = `${vehicles.name}`

            vehiclesNameBg.appendChild(vehiclesName)
            card.appendChild(vehiclesNameBg)

            card.onclick = () => {
                const modal = document.getElementById("modal")
                modal.style.visibility = "visible"

                const modalContent = document.getElementById("modal-content")
                modalContent.innerHTML = ''

                const vehiclesImage = document.createElement("div")
                vehiclesImage.style.backgroundImage = `url('${urlImg}')`
                vehiclesImage.className = "vehicles-image"

                const name = document.createElement("span")
                name.className = "vehicles-details"
                name.innerText = `Nome: ${vehicles.name}`

                const vehiclesModel = document.createElement("span")
                vehiclesModel.className = "vehicles-details"
                vehiclesModel.innerText = `modelo: ${vehicles.model}`

                const manufacturer = document.createElement("span")
                manufacturer.className = "vehicles-details"
                manufacturer.innerText = `Fabricante: ${vehicles.manufacturer}`

                const cargoCapacity = document.createElement("span")
                cargoCapacity.className = "vehicles-details"
                cargoCapacity.innerText = `Capacidade de Carga: ${convertCargoCapacity(vehicles.cargo_capacity)}`

                const vehiclesLength = document.createElement("span")
                vehiclesLength.className = "vehicles-details"
                vehiclesLength.innerText = `Comprimento: ${convertVehiclesLength(vehicles.length)}`;

                modalContent.appendChild(vehiclesImage)
                modalContent.appendChild(name)
                modalContent.appendChild(vehiclesModel)
                modalContent.appendChild(manufacturer)
                modalContent.appendChild(cargoCapacity)
                modalContent.appendChild(vehiclesLength)

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
    
    await loadVehicles(responseJson.next)

    }catch (error){
        console.log(error)
        alert('Erro ao carregar a próxima página')
    }
}

async function loadPreviousPage() {
    if (!currentPageUrl) return;

    try {
    const response = await fetch(currentPageUrl)
    const responseJson = await response.json()
    
    await loadVehicles(responseJson.previous)

    }catch (error){
        console.log(error)
        alert('Erro ao carregar a página anterior')
    }
}

function hideModal() {
    const modal = document.getElementById("modal")
    modal.style.visibility = "hidden"
}

function convertCargoCapacity(cargoCapacity){
    if(cargoCapacity === "unknown") {
        return "Desconhecido"
    }
   
    return `${cargoCapacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} t`
    
}

function convertVehiclesLength(vehiclesLength) {
   
    return `${vehiclesLength.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} m`
}