class Model {
    constructor() {
        this.poems = [];
        this.fetchPoems();
    }

    async fetchPoems() {
        const response = await fetch("./data.json")
        let data = await response.json();
        this.poems = data;
    }
}

class View {
    constructor() {
        this.poemsDiv = document.getElementById("poemsDiv");
    }

    bindLoadPoems(handler) {
        window.addEventListener("load", (event) => {
            event.preventDefault();
            handler()
        })
    }

    clearPoemsDiv() {
        this.poemsDiv.innerHTML = '<h2 class="mb-5">poems</h2>'
    }

    addPoem(poem) {
        let div = document.createElement("div");
        div.classList.add("mb-5");

        let title = document.createElement("h3");
        title.textContent = poem.title;
        div.appendChild(title);

        let meta = document.createElement("p");
        meta.textContent = `${poem.year} | ${poem.collection}`;
        meta.classList.add("meta");
        div.appendChild(meta);

        for (let i = 0; i < poem.paragraphs.length; i++) {
            let p = document.createElement("p");
            p.innerHTML = poem.paragraphs[i];
            div.appendChild(p);
        }

        this.poemsDiv.appendChild(div);
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    getAllPoems() {
        return this.model.poems;
    }

    getPoemsByYear(year) {
        let filteredPoems = [];
        for (let i = 0; i < this.model.poems.length; i++) {
            if (this.model.poems[i].year == year) filteredPoems.push(this.model.poems[i]);
        }
        return filteredPoems;
    }

    getPoemsByCollection(collection) {
        let filteredPoems = [];
        for (let i = 0; i < this.model.poems.length; i++) {
            if (this.model.poems[i].collection == collection) filteredPoems.push(this.model.poems[i]);
        }
        return filteredPoems;
    }

    getPoemById(id) {
        return this.model.poems[id];
    }

    displayPoems(poems) {
        this.view.clearPoemsDiv();
        for (let i = poems.length - 1; i >=0; i--) {
            this.view.addPoem(poems[i]);
        }
    }

    async waitAndDisplayAllPoems() {
        await this.model.fetchPoems();
        this.displayPoems(this.model.poems);
    }
}

window.onload = (event) => {
    const app = new Controller(new Model(), new View());
    app.waitAndDisplayAllPoems()
};
