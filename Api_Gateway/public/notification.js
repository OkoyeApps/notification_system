(
    window.onload = function () {
    var socket1 = io.connect("http://localhost:8080");
    var socket2 = io.connect("http://localhost:8080/notification");
    socket2.emit("notify", {data: "aa"});
    socket2.emit("online",{user_id : 1});

});



