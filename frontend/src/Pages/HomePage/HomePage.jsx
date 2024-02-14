import axios from '../../axios';
import React, { useState, useEffect } from 'react';
import AdminHomepage from '../../components/adminHomepage';

const HomePage = ({  }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState("");
    useEffect(() => {
        axios().get("/getUser").then((res) => {
            setUser(res.data.user);
            setIsAdmin("admin" == res.data.user)
    })}, []);
    const [tripInProgress, setTripInProgress] = useState(false);
    const [rideDetails, setRideDetails] = useState({
        PassengerName: "",
        tripId: "",
        driverName: "",
        driverPhone: "",
        cabNumber: ""
    });
    const [review, setReview] = useState("");
    const logOut = () => {
        localStorage.removeItem("token");
        window.location.reload();
      };
    const toggleTripStatus = () => {
        if (!tripInProgress) {
            axios().get("http://localhost:3000/getTrip/"+user).then((res) => {
                setRideDetails({
                    PassengerName: res.data.trip.PassengerName,
                    tripId: res.data.trip.tripId,
                    driverName: res.data.trip.driverName,
                    driverPhone: res.data.trip.driverPhone,
                    cabNumber: res.data.trip.cabNumber
                });
                setTripInProgress(true);
            })
        } else {
            setTripInProgress(false);
        }
    };

    const generateLink = () => {
        if (tripInProgress) {
            const message = `Trip Details\nTrip ID: ${rideDetails.tripId}\nDriver Name: ${rideDetails.driverName}\nDriver Phone: ${rideDetails.driverPhone}\nCab Number: ${rideDetails.cabNumber}`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappLink = `https://wa.me/?text=${encodedMessage}`;
            window.location.href = whatsappLink;
        } else {
            alert("Trip expired");
        }
    };

    const submitReview = (event) => {
        event.preventDefault();
        axios().patch("http://localhost:3000/addReview/1234", {
            review: review
        }).then((res) => {
            alert("Review submitted successfully!");
        }).catch((err) => {
            alert("Failed to submit review!");
        });
        
        setReview("");
    };

    return (
        <div>
            {!isAdmin && (
                <>
                    <button onClick={generateLink}>Generate Link</button>
                    <button onClick={toggleTripStatus}>{tripInProgress ? <b>End trip</b> : <b>Start trip</b>}</button>
                    {tripInProgress ? 
                    
                    <div>
                        <p>
                        Driver Name: {rideDetails.driverName}<br/>
                        Driver Phone: {rideDetails.driverPhone}<br/>
                        Cab Number: {rideDetails.cabNumber}</p>
                    </div>
                    : ""}
                    {tripInProgress ? "" : (
                        <form onSubmit={submitReview}>
                            <label>
                                Review:
                                <input type="text" value={review} onChange={(event) => {
                                    setReview(event.target.value);
                                }} />
                            </label>
                            <button type="submit">Submit Review</button>
                        </form>
                    )}
                </>
            )}

            {isAdmin && (
                <AdminHomepage/>
            )}
            <button onClick={logOut}>logout</button>
        </div>
    );
};

export default HomePage;


