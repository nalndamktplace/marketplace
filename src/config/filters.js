export const EXPLORE_PAGE_FILTERS = [
    {
        name: "market",
        label: "Market",
        type: "tab",
        values: [
            {value:"new",label:"New Books"},
            {value:"old",label:"Old Books"},
        ],
    },
    { name: "price", label:"Price", type: "range", min: 0, max: 1000, step: 10 },
    {
        name: "collections",
        label: "Collections",
        type: "select",
        values: [
            {value:"bestselling",label:"Bestselling"},
            {value:"bestoffiction",label:"Best of Fiction"},
            {value:"bestofnonfiction",label:"Best of Non-Fiction"},
            {value:"newrelease",label:"New Release"},
        ],
    },
    {
        name: "genres",
        label: "Genres",
        type: "multiselect",
        values: [
            {value:"adventure",label : "adventure"},
            {value:"art",label : "art"},
            {value:"autobiography",label : "autobiography"},
            {value:"biography",label : "biography"},
            {value:"business",label : "business"},
            {value:"childrensfiction",label : "Children's fiction"},
            {value:"cooking",label : "cooking"},
            {value:"fantasy",label : "fantasy"},
            {value:"healthandfitness",label : "health & fitness"},
            {value:"historicalfiction",label : "historical fiction"},
            {value:"history",label : "history"},
            {value:"horror",label : "horror"},
            {value:"humor",label : "humor"},
            {value:"inspirational",label : "inspirational"},
            {value:"mystery",label : "mystery"},
            {value:"romance",label : "romance"},
            {value:"selfhelp",label : "selfhelp"},
            {value:"sciencefiction",label : "science fiction"},
            {value:"thriller",label : "thriller"},
            {value:"travel",label : "travel"},
        ],
    },
    {
        name: "orderby",
        label: "Order By",
        type: "select",
        values: [
            {value:"PRICE_L_H",label:"Price - Low to High"},
            {value:"PRICE_H_L",label:"Price - High to Low"},
            {value:"RATING_L_H",label:"Rating - Low to Hight"},
            {value:"RATING_H_L",label:"Rating - High to Low"},
        ],
    }
];


export const ACCOUNT_PAGE_FILTERS = [
    { name: "price", label:"Price", type: "range", min: 0, max: 1000, step: 10 },
    {
        name: "genres",
        label: "Genres",
        type: "multiselect",
        values: [
            {value:"adventure",label : "adventure"},
            {value:"art",label : "art"},
            {value:"autobiography",label : "autobiography"},
            {value:"biography",label : "biography"},
            {value:"business",label : "business"},
            {value:"childrensfiction",label : "Children's fiction"},
            {value:"cooking",label : "cooking"},
            {value:"fantasy",label : "fantasy"},
            {value:"healthandfitness",label : "health & fitness"},
            {value:"historicalfiction",label : "historical fiction"},
            {value:"history",label : "history"},
            {value:"horror",label : "horror"},
            {value:"humor",label : "humor"},
            {value:"inspirational",label : "inspirational"},
            {value:"mystery",label : "mystery"},
            {value:"romance",label : "romance"},
            {value:"selfhelp",label : "selfhelp"},
            {value:"sciencefiction",label : "science fiction"},
            {value:"thriller",label : "thriller"},
            {value:"travel",label : "travel"},
        ],
    },
    {
        name: "orderby",
        label: "Order By",
        type: "select",
        values: [
            {value:"PRICE_L_H",label:"Price - Low to High"},
            {value:"PRICE_H_L",label:"Price - High to Low"},
            {value:"RATING_L_H",label:"Rating - Low to Hight"},
            {value:"RATING_H_L",label:"Rating - High to Low"},
        ],
    }
];
