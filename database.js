const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = new Sequelize('dcpa8lqsp26kc9', 'qcbaydmcpcnkui', '98ab3280f76d900aab1212b5e072b2eb1291dad86297e1980449bf325a52c87b', {
  host: 'ec2-79-125-117-53.eu-west-1.compute.amazonaws.com',
  dialect: 'postgres',
  dialectOptions:{
    ssl:true
 },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const Team = sequelize.define('team', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: Sequelize.STRING,
    isActive: Sequelize.BOOLEAN,    
})

const People = sequelize.define('people', {
  email: {type: Sequelize.STRING, primaryKey: true },
  name: Sequelize.STRING,
  isExternal: Sequelize.BOOLEAN,
  isActive: Sequelize.BOOLEAN,
  represents:Sequelize.STRING,
  position: Sequelize.STRING,
  team_id: {
    type: Sequelize.INTEGER,
 
    references: {
      // This is a reference to another model
      model: Team,
 
      // This is the column name of the referenced model
      key: 'id',
 
      // This declares when to check the foreign key constraint. PostgreSQL only.
      deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
  }
});

const Facilities = sequelize.define('facility', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:Sequelize.STRING,
    price:Sequelize.INTEGER
})

const Room = sequelize.define('room', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    location: Sequelize.STRING,
    price: Sequelize.INTEGER,
    capacity:Sequelize.INTEGER,
})




const Booking = sequelize.define('booking', {
    start_time:Sequelize.DATE,
    end_time:Sequelize.DATE,
    price:Sequelize.INTEGER,
    bookedByEmail: {
        type: Sequelize.STRING,
        references: {
          model: People,
          key: 'email',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
    // bookedByEmail:Sequelize.INTEGER,
      roomId: {
        type: Sequelize.INTEGER,
     
        references: {
          // This is a reference to another model
          model: Room,
     
          // This is the column name of the referenced model
          key: 'id',
     
          // This declares when to check the foreign key constraint. PostgreSQL only.
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      }
});

Booking.belongsTo(People, {as:"booked_by"})
Booking.belongsTo(Room, {as:"room"});

Booking.belongsToMany(People, {through: 'UserBooking', as:"people"});
People.belongsToMany(Booking, {through: 'UserBooking', as:"people"});

Booking.belongsToMany(Facilities, {through:'FacilityBooking', as:"facility"})
Facilities.belongsToMany(Booking, {through:'FacilityBooking', as:"facility"})


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
                    resolve("Data initiated successfully!")                    
                }).catch((err) => {
                    reject(err);
                })
            } else {
                resolve("Initiated");
            }
         }).catch((err)=>{
             console.log("BIG PROBLEMS")
             reject(err)
         });
    })
}

module.exports.getAllPeople = function(){
    return People.findAll();
}

module.exports.getAllrooms = function(){
    return Room.findAll();
}

module.exports.deleteBooking = function(id){
    return Booking.findById(id).then((res) => {
        return res.destroy()
    })
}

module.exports.getBookingById = function(id){
    return Booking.findById(id);
}

module.exports.getFacilities = function(){
    return Facilities.findAll()
}

module.exports.createBooking = function(startTime, endTime, bookedBy, room, people, facilities, price){
    console.log("wow")
    console.log(price)
    return new Promise((resolve,reject) => {
        Booking.findAll({
            where:{
                roomId:room,
                start_time:{
                        [Op.lte]: startTime             
                },
                end_time:{
                    [Op.gte]: startTime

                }
            }
        }).then((result) => {
            if(result.length !== 0){
                reject("Det är redan bokat denna tid");
            } else{
                return Booking.findAll({
                    where:{
                        roomId:room,
                        start_time:{
                                [Op.lte]: endTime             
                        },
                        end_time:{
                            [Op.gte]: endTime
                        }
                    }
                })
            }
        }).then((result) => {
            if(result.length !== 0){
                reject("Det är redan bokat denna tid");
            } else{
                return Booking.findAll({
                    where:{
                        roomId:room,
                        start_time:{
                                [Op.gte]: startTime             
                        },
                        end_time:{
                            [Op.lte]: endTime
                        }
                    }
                })
            }
        }).then((result) => {
            if(result.length !== 0){
                reject("Det är redan bokat denna tid!")
            } else{
                Booking.create({
                    start_time:startTime,
                    end_time:endTime,
                    bookedByEmail:bookedBy,
                    roomId:room,
                    price:price
                }).then((booking) =>{
                     booking.setPeople(people).then((res) =>{
                        return booking.setFacility(facilities)                        
                     });
                }).then((result) => {
                    resolve({});                    
                }).catch((err) =>{
                    console.log(err);
                    reject(err);
                });
            }
        });
    });
}



module.exports.getBookings = function(startTime, endTime, room){
    return Booking.findAll({
         where: {
           start_time:{
             [Op.gte]: startTime
           },
           end_time:{
             [Op.lte]: endTime
           },
           roomId:room 
         },
         include:[{
            model: People,
            as:"people"
         },
         {
            model: People,
            as:"booked_by"
        }]
    })
}

module.exports.getFreeRooms = function(startTime, endTime){
    return Booking.findAll({
        where: {
          start_time:{
            [Op.gte]: startTime
          },
          end_time:{
            [Op.lte]: endTime
          }
        },
        include:[{
           model: People,
           as:"people"
        },
        {
           model: People,
           as:"booked_by"
       }]
   }).then((result) => {
       let bookedRooms = result.map((booking) => {
           return booking.roomId
       })
       console.log(bookedRooms);
       let uniqueArray = bookedRooms.filter(function(item, pos, self) {
            return self.indexOf(item) == pos;
        })

        return Room.findAll().then((rooms) =>{
            let freeRooms = rooms.map((room) =>{
                let exists = false;
                uniqueArray.map((id) => {
                    if(room.id === id){
                        exists =true;
                    }
                })

                if(!exists){
                    return room
                }
            })

            return freeRooms;

        })

   })
}

module.exports.getCosts = function(startTime, endTime, team){
    return Booking.findAll({
        where: {
            start_time:{
              [Op.gte]: startTime
            },
            end_time:{
              [Op.lte]: endTime
            },
        },
        include:[
            {
                model: People,
                as:"booked_by"
            },
            {
                model:Room,
                as:"room"
            }
        ]
    })
}

let initRooms = () => {
    var rooms = []
    rooms.push(Room.create({
        capacity:1,
        price:800,
        location:'Mars'
    }));

    rooms.push(Room.create({
        capacity:100,
        price:1000,
        location:'Sarturnus'
    }));
    rooms.push(Room.create({
        capacity:12,
        price:700,
        location:'Pluto'
    }));
    rooms.push(Room.create({
        capacity:127,
        price:500,
        location:'Neptunus'
    }));

    return Promise.all(rooms);
}

let initBookings = () => {

}

let initTeams = () => {
    var teams = []
    teams.push(Team.create({
        name: 'Development',
        isActive:true
    }));

    teams.push(Team.create({
        name: 'Design',
        isActive:true
    }));
    teams.push(Team.create({
        name: 'HR',
        isActive:true
    }));
    teams.push(Team.create({
        name: 'Financial',
        isActive:true
    }));

    return Promise.all(teams);

}


let initFacilities = () => {
    var facilities = [];
    facilities.push(Facilities.create({
        name:"Sked",
        price: 100
    }));

    facilities.push(Facilities.create({
        name:"Gaffel",
        price:200
    }));

    facilities.push(Facilities.create({
        name:"Kniv",
        price:300
    }));
}

let initPeople = () => {
    var people = []
    people.push(People.create({
        name: 'Oskar Råhlén',
        email:'rahlenoskar@gmail.com',
        isExternal: false,
        position:'CTO',
        team_id:1,
        isActive:true
    }));

    people.push(People.create({
        name: 'Sacharias Sjöqvist',
        email:'sachsjo@gmail.com',
        isExternal: false,
        position:'CEO',
        team_id:2,
        isActive:true
    }));

    people.push(People.create({
        name: 'Sven Svensson',
        email:'svensvensson@gmail.com',
        isExternal: true,
        position:'Developer',
        team_id:4,
        isActive:true
    }));

    people.push(People.create({
        name: 'Karl Karlsson',
        email:'karlkarlsson@gmail.com',
        isExternal: false,
        position:'CFO',
        team_id:3,
        isActive:true
    }));

    return Promise.all(people);
}