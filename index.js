const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(morgan(":person"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const randomNumber = () => {
  const arrayOfNumbersGenerated = []; // closure, (private array).
  return function randomNumberGenerator() {
    const rand = Math.floor(Math.random() * 10000);
    if (arrayOfNumbersGenerated.includes(rand)) {
      randomNumberGenerator();
    } else {
      arrayOfNumbersGenerated.push(rand);
      return rand;
    }
  };
};
const randomId = randomNumber();

const returnApiInfo = () => {
  const totalPeople = persons.length;
  console.log(totalPeople);
  return `<div>
  <h3>Phonebook has info on ${totalPeople} people.<h3> 
  <h3>${new Date()}</h3>
  </div>`;
};

app.get("/", (request, response) => {
  response.send("<h1>PhoneBookApi</h1>");
});
app.get("/api/persons/", (request, response) => {
  response.json(persons);
});
app.get("/info/", (request, response) => {
  response.send(returnApiInfo());
});
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  person ? response.json(person) : response.status(404).end();
});
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Phone Or Number Missing.",
    });
  }
  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "That name already exists!",
    });
  }

  const personsInfo = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: randomId(),
  };

  persons = persons.concat(personsInfo);
  // console.log(personsInfo);
  morgan.token("person", function (req, res) {
    return [
      `name: ${personsInfo.name}`,
      `number: ${personsInfo.number}`,
      `date: ${personsInfo.date}`,
      `id: ${personsInfo.id}`,
    ].join(" | ");
  });

  res.json(personsInfo);
});

const PORT = 3002;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
