const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// const Person = mongoose.model("Person", phonebookSchema);

// if (process.argv[4] === undefined) {
//   console.log("phonebook:");
//   mongoose.connect(url);
//   Person.find({})
//     .then((result) => {
//       result.forEach((person) => {
//         console.log(person.name, person.number);
//       });
//       return mongoose.connection.close();
//     })
//     .catch((err) => console.log(err));
// } else {
//   mongoose
//     .connect(url)
//     .then((result) => {
//       console.log("Connected");

//       const person = new Person({
//         name: process.argv[3],
//         number: process.argv[4],
//         date: new Date(),
//       });
//       return person.save();
//     })
//     .then(() => {
//       console.log("person saved!");
//       return mongoose.connection.close();
//     })
//     .catch((err) => console.log(err));
// }

module.exports = mongoose.model("Person", phonebookSchema);
