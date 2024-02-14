import React from 'react';
import { useState,useEffect } from 'react';
import axios from '../axios';

function AdminHomepage () {
  const [allRides, setAllRides] = useState([]);
  useEffect(() => {
    axios().get("/getAllTrips").then((res) => {
        setAllRides(res.data.trips);
        console.log(res.data.trips);
        })
  }, []);
  return (
    <div>
      <h1>Admin Homepage</h1>
      {allRides.length < 0 ? "":
        allRides.map((ride) => {
          return (
            <div>
              <p>tripID : {ride.tripId}<br/>
              Passenger Name : {ride.PassengerName}<br/>
              Driver name : {ride.driverName}<br/>
              Driver Number : {ride.driverPhone}<br/>
              Cab Number : {ride.cabNumber}<br/>
              Review of ride : {ride.review}</p>
            </div>
          );
        })
      }
    </div>
  );
};

export default AdminHomepage;
