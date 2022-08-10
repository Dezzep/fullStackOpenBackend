require("dotenv").config();
const { response } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./phonebook");
const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
};

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);
morgan.token("type", function (req, res) {
  return [JSON.stringify(req.body)];
});
app.use(errorHandler);

const returnApiInfo = (count) => {
  return `<div>
   <h3>Phonebook has info on ${count} people.<h3>
   <h3>${new Date()}</h3>
   </div>`;
};

// get
app.get("/", (request, response) => {
  response.send("<h1>PhoneBookApi</h1>");
});
app.get("/api/people/", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});
app.get("/info/", (request, response) => {
  Person.find({}).then((person) => {
    response.send(returnApiInfo(person.length));
  });
});
app.get("/api/people/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end();
    })
    .catch((error) => next(error));
});

//delete
app.delete("/api/people/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

//post
app.post("/api/people", (req, res) => {
  const body = req.body;
  // already dealth with on the front end, but just incase.
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Phone Or Number Missing.",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

// put .. if there is already a name, change the number
app.put("/api/people/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
    // creation date is not altered if number is swapped.
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })

    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
