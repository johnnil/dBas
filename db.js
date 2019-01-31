const Sequelize = require('sequelize');
const sequelize = new Sequelize("d50kn7hulfucfv", "dtcftvyppyyeyz", "0ed542650c240c8446a319d614d69986d0ab1f9dd00fb6a7452df5a17af7ec08", {
  host: 'ec2-54-221-220-59.compute-1.amazonaws.com',
  dialect: 'postgres',
  dialectOptions: {
      ssl:true
  },
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }

});

sequelize
    .authenticate()
    .then(() => {
        console.log("I'm into the mainframe, or In to the frame once more.");
    })
    .catch(err => {
        console.error('NOOOOOO', err);
    });

const Team = sequelize.define('team', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: Sequelize.STRING,
    accrued_cost: Sequelize.INTEGER,
    active: Sequelize.BOOLEAN,
})


const Room = sequelize.define('room', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    capacity: Sequelize.INTEGER,
    name: Sequelize.STRING,
    hourly_price: Sequelize.INTEGER
})


const Person = sequelize.define('person', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    internal: Sequelize.BOOLEAN,
    team: {
      type: Sequelize.INTEGER,
      references: {
      model: Team,
      key: 'id',
      }
    },
    company: Sequelize.STRING,
    position: Sequelize.STRING,
})

const Booking = sequelize.define('booking', {
  id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement:true
  },
  booker: {
    type: Sequelize.INTEGER,
    references: {
      model: Person,
      key: 'id',
    }
},
  start: Sequelize.INTEGER,
  end: Sequelize.INTEGER,
  room: {
    type: Sequelize.INTEGER,
    references: {
      model: Room,
      key: 'id',
        }
    },
})


const Facility = sequelize.define('facility', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    type: Sequelize.STRING, //"type" might be keyworded
    room: {
      type: Sequelize.INTEGER,
      references: {
        model: Room,
        key: 'id',
      }
    }
})




Team.sync({force: true}).then(() => {
    return Team.create({
        name: 'Fatboys',
        active: true,
        accrued_costs: 0
    });
});

/*
Person.sync({force: true}).then(() => {
    return Person.bulkCreate([
        {
            name: 'Susan var der Bolt',
            internal: false,
            team: null,
            company: 'Bolt Industries',
            position: 'CEO'
        },
        {
            name: 'Geoff Stranger',
            internal: false,
            team: null,
            company: 'Webillumination',
            position: 'Con-sultan'
        },
        {
            name: 'Jonatan Doh',
            internal: true,
            team: 1,
            company: 'Jompa & Jompa',
            position: 'Spy'
        },
        {
            name: 'John Doe',
            internal: true,
            team: 2,
            company: 'Jompa & Jompa',
            position: 'Coffee fetcher'
        }
    ]).then(() => {
        return Person.findAll();
    }).then(person => {
        console.log(person)
    })
});

*/


//Relationship degrees
Booking.belongsTo(Person, {as:"booker1"});
Booking.belongsTo(Room, {as:"room1"});

Team.hasMany(Person, {as:"person"});

Schedule_event.belongsTo(Person, {as:"person1"});
Schedule_event.belongsTo(Room, {as: "room1"});

Facility.belongsTo(Room, {as: "room1"});

module.exports.getPeople = function() {
    return Person.findAll();
}

module.exports.getRooms = function()  {
    return Room.findAll();
}

module.exports.getTeams = function() {
    return Team.findAll();
}

module.exports.deleteBooking = function(id) {
    return Booking.findById(id).then((res) => {
        return res.destroy()
    })
}

module.exports.getFacilities = function() {
    return Facilities.findAll();
}

module.exports.initDatabase =  function(addMockData){
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            if(addMockData){
                initTeams().then(() => {
                    return initPeople();
                }).then(() => {
                    return initRooms();
                }).then(() => {
                    return initFacilities()
                }).then(() => {
                    resolve("Database initialized")
                }).catch((err) => {
                    reject(err);
                })
            } else {
                resolve("Dunno what happened");
            }
         }).catch((err)=>{
             console.log("Something went wrong")
             reject(err)
         });
    })
}

// Create rows:
let initRooms = () => {
    var rooms = []
    rooms.push(Room.create({
        capacity:12,
        name: 'Dozen'
        hourly_price:10,
    }));

    rooms.push(Room.create({
        capacity:6,
        name: 'Erfors'
        hourly_price:8,
    }));
    rooms.push(Room.create({
        capacity:20,
        name: 'Nightingale'
        hourly_price:14,
    }));
    rooms.push(Room.create({
        capacity:4,
        name: 'Henderson'
        hourly_price:7,
    }));

    return Promise.all(rooms);
}

let initBookings = () => {
  var bookings = []
  bookings.push(booking.create({
    booker:1,
    start:800,
    end:1000,
    room:1
  }));
  bookings.push(booking.create({
    booker:1,
    start:1500,
    end:1700,
    room:2
  }));
}

let initTeams = () => {
    var teams = []
    teams.push(Team.create({
        name: 'Stonemasters',
        accrued_cost: 0,
        isActive:false
    }));

    teams.push(Team.create({
        name: 'Bonecracker Gang',
        accrued_cost: 15,
        isActive:true
    }));

    teams.push(Team.create({
        name: 'The Warriors',
        accrued_cost: 78,
        isActive:true
    }));

    teams.push(Team.create({
        name: 'Springnota',
        accrued_cost: 1031,
        isActive:false
    }));

    return Promise.all(teams);
}

let initFacilities = () => {
    var facilities = [];
    facilities.push(Facilities.create({
        name:"Whiteboard",
        room: 1
    }));

let initPerson = () => {
    var person = []
    person.push(Person.create({
        name: 'John Doe',
        internal: true,
        team:1,
        company:'Jompa & Jompa',
        position:'Coffee Fetcher'
    }));

    person.push(Person.create({
        name: 'Jonatan Doh',
        internal: true,
        team:2,
        company:'Jompa & Jompa',
        position:'Spy'
    }));

    return Promise.all(people);
}
