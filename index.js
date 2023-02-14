const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const dataPath = './data.json';

let data = [];
fs.readFile(dataPath, (err, datas) => {
  if (err) {
    console.error(err);
    return;
  }

  data = JSON.parse(datas.toString());
});

app.use(express.json());

app.post('/', (req, res) => {
  const newItem = { id: data.length + 1, name: req.body.name };
  data.push(newItem);

  fs.writeFile(dataPath, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while saving the item.');
    }

    res.send(newItem);
  });
});

app.get('/', (req, res) => {
  res.send(data);
});

app.get('/:id', (req, res) => {
  const item = data.find(item => item.id == req.params.id);
  if (!item) return res.status(404).send('The item with the given ID was not found.');
  res.send(item);
});

app.put('/:id', (req, res) => {
  const itemIndex = data.findIndex(item => item.id == req.params.id);
  if (itemIndex === -1) return res.status(404).send('The item with the given ID was not found.');
  data[itemIndex].name = req.body.name;

  fs.writeFile(dataPath, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while saving the item.');
    }

    res.send(data[itemIndex]);
  });
});


app.delete('/:id', (req, res) => {
  const itemIndex = data.findIndex(item => item.id == req.params.id);
  if (itemIndex === -1) return res.status(404).send('The item with the given ID was not found.');
  const deletedItem = data.splice(itemIndex, 1);

  fs.writeFile(dataPath, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while deleting the item.');
    }

    res.send("Deleted successfully");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
