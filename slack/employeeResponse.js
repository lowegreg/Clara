var options = []
for (var i = 0; i < state.employee.length; i++) {
    options.push({
        "text": state.employee[i].name,
        "value": " {\"name\": \"" + state.employee[i].name + "\", \"id\":" + state.employee[i].id + "}"
    })
}
return res.json({

    "options": options

});