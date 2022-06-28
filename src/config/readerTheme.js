export const ReaderPreferenceOptions = {
    fontSize   : { min : 100 , max : 250, step: 10, offset : 50},
    lineHeight : { min : 1  , max : 2  , step: .25},
    fontFamily : [
        { id:"reader-font-family-arial"    , name: "Arial"          , value: "'Arial', sans-serif"       },
        { id:"reader-font-family-times"    , name: "Times New Roman", value: "'Times New Roman', serif"  },
        { id:"reader-font-family-trebuchet", name: "Trebuchet MS"   , value: "'Trebuchet MS', sans-serif"},
    ],
    themes : [
        { id:"reader-theme-light", label : "light",  backgroundColor : "white", color : "black" },
        { id:"reader-theme-dark" , label : "dark" ,  backgroundColor : "black", color : "white" },
    ],
};

export const ReaderDefault = {
    fontSize   : 170 ,
    lineHeight : 1.6 ,
    fontFamily : ReaderPreferenceOptions.fontFamily.find(ff => ff.id === "reader-font-family-arial"),
    theme      : ReaderPreferenceOptions.themes.find(t => t.id === "reader-theme-light"),
};

export const ReaderBaseTheme = {
    body : {
        "--font-family"      : ReaderDefault.fontFamily.value,
        "--font-size"        : ReaderDefault.fontSize+"%",
        "--line-height"      : ReaderDefault.lineHeight,
        "--background-color" : ReaderDefault.theme.backgroundColor ,
        "--color"            : ReaderDefault.theme.color,

        "background-color" : "var(--background-color) !important",
        "color" : "var(--color) !important",
        "font-size" : "var(--font-size) !important",
    },
    p : {
        "text-align": "justify" ,
        "font-family" : "var(--font-family) !important",
        "line-height" : "var(--line-height) !important"
    },
};
