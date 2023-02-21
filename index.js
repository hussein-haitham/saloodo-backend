const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = 3000;
const secretKey = crypto.randomBytes(32);

app.use(cors());

const bikers = [
  {
    id: 1,
    name: "Biker 1",
    email: "biker1@example.com",
    password: "password1",
  },
  {
    id: 2,
    name: "Biker 2",
    email: "biker2@example.com",
    password: "password2",
  },
  {
    id: 3,
    name: "Biker 3",
    email: "biker3@example.com",
    password: "password3",
  },
  {
    id: 4,
    name: "Biker 4",
    email: "biker4@example.com",
    password: "password4",
  },
  {
    id: 5,
    name: "Biker 5",
    email: "biker5@example.com",
    password: "password5",
  },
  {
    id: 6,
    name: "Biker 6",
    email: "biker6@example.com",
    password: "password6",
  },
  {
    id: 7,
    name: "Biker 7",
    email: "biker7@example.com",
    password: "password7",
  },
  {
    id: 8,
    name: "Biker 8",
    email: "biker8@example.com",
    password: "password8",
  },
  {
    id: 9,
    name: "Biker 9",
    email: "biker9@example.com",
    password: "password9",
  },
  {
    id: 10,
    name: "Biker 10",
    email: "biker10@example.com",
    password: "password10",
  },
];

const senders = [
  {
    id: 1,
    name: "Sender 1",
    email: "sender1@example.com",
    password: "password1",
  },
  {
    id: 2,
    name: "Sender 2",
    email: "sender2@example.com",
    password: "password2",
  },
  {
    id: 3,
    name: "Sender 3",
    email: "sender3@example.com",
    password: "password3",
  },
  {
    id: 4,
    name: "Sender 4",
    email: "sender4@example.com",
    password: "password4",
  },
  {
    id: 5,
    name: "Sender 5",
    email: "sender5@example.com",
    password: "password5",
  },
];
let parcels = [];

app.use(express.json());

//Get all parcels
app.get("/api/parcels", (req, res) => {
  res.status(200).json(parcels);
});

//Get active parcels by biker
app.post("/api/activeParcels", (req, res) => {
  const activeParcels = parcels.filter((parcel) => {
    if (parcel.biker.id) {
      return parcel.biker.id === req.body.bikerId;
    }
    return false;
  });

  res.status(200).json(activeParcels);
});
//Get sender paercels
app.post("/api/senderParcels", (req, res) => {
  let senderParcels = [];

  for (let i = 0; i < parcels.length; i++) {
    if (parcels[i].sender.id === req.body.user.id) {
      senderParcels.push(parcels[i]);
    }
  }

  res.status(200).json(senderParcels);
});

//Create new parcel request
app.post("/api/parcels", (req, res) => {
  const newParcel = req.body;
  newParcel.id = Math.random().toString(36);

  parcels.push(newParcel);
  res.status(200).json(newParcel);
});

// Assign parcel to biker
app.post("/api/parcelsBikers", (req, res) => {
  const biker = req.body.biker;
  const parcel = req.body.parcel;

  let newParcel = {};

  for (let i = 0; i < parcels.length; i++) {
    if (parcels[i].id === parcel.id) {
      parcels[i].biker = { ...biker };
      parcels[i].deliveryDate = req.body.deliveryDate;
      parcels[i].pickupDate = req.body.pickupDate;
      parcels[i].status = "Order in delivery";
      newParcel = { ...parcels[i] };
    }
  }
  res.status(200).json({ newParcel });
});

//Sender authentication and returning JWT token
app.post("/api/loginUser", (req, res) => {
  const user = senders.find((sender) => sender.email === req.body.email);
  const password = senders.find(
    (sender) => sender.password === req.body.password
  );

  if (user && password) {
    const token = jwt.sign({ user: user.id }, secretKey);
    res.status(200).json({ user, token });
  } else {
    res.status(401).json("User not found");
  }
});

//Biker authentication and returning JWT token
app.post("/api/loginBiker", (req, res) => {
  const biker = bikers.find((biker) => biker.email === req.body.email);
  const password = bikers.find((biker) => biker.password === req.body.password);

  if (biker && password) {
    const token = jwt.sign({ user: biker.id }, secretKey);
    res.status(200).json({ biker, token });
  } else {
    res.status(401).json("Biker not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
