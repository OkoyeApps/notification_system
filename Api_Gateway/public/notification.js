(
    window.onload = function () {
        var socket1 = io.connect("http://localhost:8080");
        var socket2 = io.connect("http://localhost:8080/notification");
        // socket2.emit("notify", { user_id: 1, message: "testing from client" });
        socket2.emit("online", { user_id: 1 });
        socket2.on("new_notification", (data) => {
        });
    });



