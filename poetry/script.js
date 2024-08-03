class Model {
    constructor() {
        this.poems = [];
        this.fetchPoems();

        this.yearsChecked = new Set([]);
    }

    async fetchPoems() {
        const response = await fetch("../data/poems.json")
        let data = await response.json();
        this.poems = data;
    }

}

class View {
    constructor() {
        this.poemsDiv = document.getElementById("poemsDiv");

        this.formYear = document.getElementById("formYear")
        this.y2024 = document.getElementById("2024");
        this.y2023 = document.getElementById("2023");
        this.y2022 = document.getElementById("2022");
        this.y2021 = document.getElementById("2021");
        this.y2020 = document.getElementById("2020");


    }

    clearPoemsDiv() {
        this.poemsDiv.innerHTML = '<h2 class="mb-5">poems</h2>'
    }

    clearCheckboxes() {
        this.y2024.checked = false;
        this.y2023.checked = false;
        this.y2022.checked = false;
        this.y2021.checked = false;
        this.y2020.checked = false;
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

    bindFilterByYear(handler) {
        this.formYear.addEventListener("input", event => {
            if (event.target.className == "form-check-input") {
                const state = event.target.checked;
                const value = Number(event.target.value);
                handler(state, value);
            }
        })
    }

}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindFilterByYear(this.handleFilterByYear)
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
        for (let i = poems.length - 1; i >= 0; i--) {
            this.view.addPoem(poems[i]);
        }
    }

    async waitAndDisplayAllPoems() {
        await this.model.fetchPoems();
        this.displayPoems(this.model.poems);
    }

    handleFilterByYear = (state, value) => {

        if (state == true) {
            this.model.yearsChecked.add(value);
            this.displayPoems(this.model.poems.filter(poem => this.model.yearsChecked.has(poem.year)));
        }

        if (state == false) {
            this.model.yearsChecked.delete(value);
            this.displayPoems(this.model.poems.filter(poem => this.model.yearsChecked.has(poem.year)));
        }

        if (this.model.yearsChecked.size == 0) {
            this.displayPoems(this.model.poems)
        }
        
    }
}

const app = new Controller(new Model(), new View());

window.onload = () => {
    app.waitAndDisplayAllPoems();
    app.view.clearCheckboxes();
};
