import React, { useEffect, useState } from 'react';
import "./index.css";
import socket from 'socket.io-client';
const io = socket.connect("http://localhost:8080/notification");

const Notification = ({ userId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [socktClient, setSocketClient] = useState(io);
    const [oldNotification, setOldNotification] = useState([]);
    const [values, setValues] = useState({
        title: "",
        message: "",
        // time: ""
    });

    let isconnected = false;
    let interval = undefined;

    useEffect(() => {
        if (!isconnected) {
            interval = setInterval(monitoSocketConnection, 1000);
        } else {
            clearInterval(interval);
        }
        getOldNotification();
    }, []);

    const monitoSocketConnection = () => {
        if (socktClient.connected) {
            socktClient.emit("online", { userid: userId });
            getNotifications();
            isconnected = true;
            clearInterval(interval);
        }
    };

    //the code here is will always cause the entire state to reload
    //once a new data is added
    //am currently out of time for reason of not been a 100% and must submit

    const getNotifications = () => {
        // socktClient.on("all_notification", data => {
        //     setOldNotification(data);
        // });
        io.on("new_notification", data => {
            setOldNotification([JSON.parse(data), ...oldNotification]);
        });
    };

    const toggleAddModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const addNotif = (e) => {
        e.preventDefault();
        toggleAddModal();
        clearForm();
    };

    const handleInputChange = (key, val) => {
        setValues({
            ...values, [key]: val
        });
    };

    const clearForm = () => {
        setValues({});
    };


    //this logic rightly should be abstracted from here, but due i started this 
    // and had to submit in a short time. i had to just add this here
    const submit = () => {
        let dataToPost = { ...values, user_id: userId };
        fetch("http://localhost:8080/api/notification",
            {
                body: JSON.stringify(dataToPost),
                headers: {
                    accept: "application/json",
                    ["content-type"]: "application/json"
                },
                method: "POST"
            })
            .then(res => res)
            .then(res => {
                clearForm();
            }).catch(error => {

            }).finally(() => {
                toggleAddModal();
            });
    };

    const getOldNotification = () => {
        fetch("http://localhost:8080/api/notification?pagenumber=1&pagesize=200",
            {
                headers: {
                    accept: "application/json",
                },
                method: "GET"
            })
            .then(res => res.json())
            .then(res => {
                setOldNotification([...res.data.reverse()]);
            }).catch(error => {
            });
    };
    return (
        <div id="notifPage">
            <div id="title">
                <div>
                    <h2>Notifications</h2>
                    <p>Manage all notifications.</p>
                </div>

                <p onClick={toggleAddModal}>Add new</p>
            </div>

           
            <section id="notificationList">
                {
                    oldNotification && oldNotification.reverse().map((x, index) => (
                        <div className="notif-item" key={index}>
                            <div>
                                <h4>{x.title}</h4>
                                <p>{x.message}</p>
                            </div>
                        </div>

                    ))
                }


            </section>

            {
                isModalVisible &&
                <div id="modalOverlay" className="d-flex justify-content-centre">
                    <div>
                        <h3>Add New Notification
                        <span onClick={toggleAddModal}>&times;</span>
                        </h3>
                        <form onSubmit={addNotif}>
                            <div class="form-group">
                                <input required onChange={(e) => handleInputChange("title", e.target.value)} defaultValue={values.title} placeholder="Enter notification header" />
                            </div>

                            <div className="form-group">
                                <textarea rows={4} className="form-control" required onChange={(e) => handleInputChange("message", e.target.value)} defaultValue={values.description} placeholder="Enter notification body" />
                                <div>
                                </div>

                                {/* <div class="form-row">
                  <div class="col-md-12 mb-3">
                    <br />
                    <label for="validationDefault02">Time</label>
                    <input type="text" class="form-control" onChange={(e) => handleInputChange("time", e.target.value)} defaultValue={values.time} type="time" required />
                  </div>
                </div> */}
                            </div>
                            <input type="button" onClick={submit} className="btn btn-primary" value="Send Notification" />
                        </form>

                    </div>
                </div>
            }

        </div>
    );
};

export default Notification;

