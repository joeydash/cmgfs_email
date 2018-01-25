function doSomething(cb) {
    for (var i = 0 ; i < 100000;i++){
        console.log(i)

    }
    var joeydash = "hey";
    console.log("ok");
    // cb(joeydash);
}
doSomething(function (joeydash) {
    console.log(joeydash);
});