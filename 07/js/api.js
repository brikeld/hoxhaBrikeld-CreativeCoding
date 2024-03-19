class Api{
    constructor(){
        /**
         * https://newsapi.org/v2/everything?q=tesla&from=2023-11-15&sortBy=publishedAt&apiKey=54729236180547bfa9a3df769b432b7b
         */
       this.apiKey = '54729236180547bfa9a3df769b432b7b';
       this.category = 'animals';
    }

    getNews(country){
        // const url =`https://newsapi.org/v2/everything?q=${topic}&from=2023-11-15&sortBy=publishedAt&apiKey=${this.apiKey}category=${this.category}`
        const url =`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${this.apiKey}`
        

        return fetch(url).then(data=>data.json()).then(json=>json);
    }
}