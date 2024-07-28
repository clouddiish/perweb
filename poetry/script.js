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
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    getAllPoems(){
        return this.model.poems;
    }

    getPoemsByYear(year){
        let filteredPoems = [];
        for (let i = 0; i < this.model.poems.length; i++){
            if (this.model.poems[i].year == year) filteredPoems.push(this.model.poems[i]);
        }
        return filteredPoems;
    }

    getPoemsByCollection(collection){
        let filteredPoems = [];
        for (let i = 0; i < this.model.poems.length; i++){
            if (this.model.poems[i].collection == collection) filteredPoems.push(this.model.poems[i]);
        }
        return filteredPoems;
    }

    getPoemById(id){
        return this.model.poems[id];
    }
}

const app = new Controller(new Model(), new View())