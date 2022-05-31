import axios from "axios";

export default class ServiceAPI {
    constructor() {
        this.options = {
            params: {
                key: '27759110-b25315ad3e5a3945aa995fc1f',
                q: '',
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: 1,
                per_page: 40,
            },
        };
    }

    async getImage() {
        const response = await axios.get('https://pixabay.com/api/', this.options);
        this.incrementPage();
        return response;
    }

    incrementPage() {
        this.options.params.page += 1;
    }

    resetPage() {
        this.pageNumber = 1;
    }

    get searchQuery() {
        return this.options.params.q = newQuery;
    }

    set searchQuery(newQuery) {
        this.options.params.q = newQuery;
    }

    get pageNumber() {
        return this.options.params.page;
    }

    set pageNumber(newNumber) {
        this.options.params.page = newNumber;
    }

}

