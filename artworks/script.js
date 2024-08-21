class Model {
    constructor() {
        this.artworks = [];
        this.fetchArtworks();
    }

    async fetchArtworks() {
        const response = await fetch("../data/imgs.json");
        let data = await response.json();
        this.artworks = data;
    }

}

class View {
    constructor() {
        this.artworksDiv = document.getElementById("artworksDiv");
    }

    clearArtworksDiv() {
        this.artworksDiv.innerHTML = '<h1 class="big-text mb-5">my artworks</h1>'
    }

    addArtwork(artwork) {
        let fig = document.createElement("figure");
        fig.classList.add("figure", "row", "align-items-end");

        let img = document.createElement("img");
        img.src = `../../imgs/${artwork.filename}`;
        img.classList.add("col-lg-6", "col-md-10", "col-sm-12");
        img.alt = artwork.alt;

        let figcap = document.createElement("figcaption");
        figcap.classList.add("col", "meta");
        figcap.innerHTML = `${artwork.title}<br>${artwork.year}`;

        fig.appendChild(img);
        fig.appendChild(figcap);

        this.artworksDiv.appendChild(fig);
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    displayArtworks(artworks) {
        this.view.clearArtworksDiv();
        for (let i = artworks.length - 1; i >= 0; i--) {
            this.view.addArtwork(artworks[i]);
        }
    }

    async waitAndDisplayAllArtworks() {
        await this.model.fetchArtworks();
        this.displayArtworks(this.model.artworks);
    }
}

const app = new Controller(new Model(), new View());

window.onload = () => {
    app.waitAndDisplayAllArtworks();
};