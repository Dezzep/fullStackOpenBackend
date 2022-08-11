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

// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms :type")
// );
// morgan.token("type", function (req, res) {
//   return [JSON.stringify(req.body)];
// });

const errorHandler = (error, request, response, next) => {
  console.log(`ERROR NAME IS +____________________+${error.name}`);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error === "ValidationError") {
    response.status(400).json({ error: "fuck" });
  }

  next(error);
};
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
app.post("/api/people", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error.message));
});

// put .. if there is already a name, change the number
app.put("/api/people/:id", (request, response, next) => {
  const body = request.body;
  const { name, number } = request.body;
  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   // creation date is not altered if number is swapped.
  // };

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )

    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error.message));
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
