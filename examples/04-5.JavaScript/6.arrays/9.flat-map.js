let books = [
    {title: "Head First JavaScript", authors: ["Dawn Griffiths", "David Griffiths"]},
    {title: "JavaScript in Action", authors: ["Dmitry Jemerov", "Svetlana Isakova"]}
]
let authors = books.flatMap(b => b.authors);
console.log(authors);
