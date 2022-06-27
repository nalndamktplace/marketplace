const readerTheme = {
    dark : {
        body : {
            "background-color" : "black",
            "color" : "white",
            "--font-family" : "inherit",
            "--line-height" : "1.6"
        },
        p : {
            "text-align": "justify" ,
            "font-family" : "var(--font-family) !important",
            "line-height" : "var(--line-height) !important"
        }
    },
    light : {
        body : {
            "background-color" : "white",
            "color" : "black",
            "--font-family" : "inherit",
            "--line-height" : "1.6"
        },
        p : {
            "text-align": "justify" ,
            "font-family" : "var(--font-family) !important",
            "line-height" : "var(--line-height) !important"
        }
    }
}

export default readerTheme ;