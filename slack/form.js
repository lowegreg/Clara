

if (req.body.payload) {

    var temp = JSON.parse(req.body.payload)

    if (temp.actions[0].name === 'employee') {
        
        var selected =JSON.parse(temp.actions[0].selected_options[0].value)
        state.first = selected.name.split(" ")[0];
        state.last =  selected.name.split(" ")[1];
        state.id= selected.id
        return res.json({
            "text": "Making a timesheet",
            "response_type": "ephemeral ", //in_channel

            "attachments": [{
                "text": "Choose a week",
                "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": "game_selection",
                "actions": [{
                    "name": "week",
                    "text": "Pick a week...",
                    "type": "select",
                    "options": [{
                            "text": "last week",
                            "value": "last"
                        }, {
                            "text": "this week",
                            "value": "this"
                        }, {
                            "text": "next week",
                            "value": "next"
                        }

                    ]
                }]
            }]
        })

    } else if (temp.actions[0].name === 'week') {
        state.week = temp.actions[0].selected_options[0].value
        return res.json({
            "text": "Making a timesheet",
            "response_type": "ephemeral ", //in_channel
            "attachments": [{
                "text": "Did they miss a day that week?",
                "fallback": "You are unable to choose a game",
                "callback_id": "missDay",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "actions": [{
                        "name": "missDay",
                        "text": "Yes",
                        "type": "button",
                        "value": "yes"
                    }, {
                        "name": "missDay",
                        "text": "No",
                        "type": "button",
                        "value": "no"
                    }

                ]
            }]
        })
    } else if (temp.actions[0].name === 'missDay') {
        if (temp.actions[0].value === 'no') {


            return res.json({
                "text": "Making a timesheet",
                "response_type": "ephemeral ", //in_channel

                "attachments": [{
                    "fallback": "Required plain-text summary of the attachment.",
                    "color": "#36a64f",
                    "author_name": "Digital Kitchener Innovation Lab",
                    "author_link": "http://flickr.com/bobby/",
                    "author_icon": "http://flickr.com/icons/bobby.jpg",
                    "title": "Timesheets file",
                    "title_link": "http://alysawoodhouse.000webhostapp.com/?firstName="+state.first+"&lastName="+state.last+"&id="+state.id+"&week="+state.week+"&daysMissed=none",
                    "text": "Save as PDF and send away",

                    "image_url": "http://my-website.com/path/to/image.jpg",
                    "thumb_url": "http://example.com/path/to/thumb.png",
                    "footer": "Timesheets",
                    "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                    "ts": 1533057980
                }]

            })

        } else if (temp.actions[0].value === 'yes') {
            state.currentDay='Monday'
            state.daysOfWeek=[ 'Monday', 'Tueday', 'Wednesday', 'Thurday', 'Friday', ]
            state.days=[]
            return res.json({
                "text": "Making a timesheet",
                "response_type": "ephemeral ", //in_channel
                "attachments": [{
                    "text": "Did they miss Monday?",
                    "fallback": "You are unable to choose a game",
                    "callback_id": "days",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [{
                            "name": "days",
                            "text": "Yes",
                            "type": "button",
                            "value": "yes"
                        }, {
                            "name": "days",
                            "text": "No",
                            "type": "button",
                            "value": "no"
                        }
    
                    ]
                }]
            })
        }
    }else if (temp.actions[0].name === 'days'){
       
        if (temp.actions[0].value === 'yes'){
            state.days.push(state.currentDay)
        }
        var location= state.daysOfWeek.indexOf(state.currentDay)
        if (location===4){
            
            return res.json({
                "text": "Making a timesheet",
                "response_type": "ephemeral ", //in_channel

                "attachments": [{
                    "fallback": "Required plain-text summary of the attachment.",
                    "color": "#36a64f",
                    "author_name": "Digital Kitchener Innovation Lab",
                    "author_link": "http://dtpm0vxfbl1oa.cloudfront.net",
                    "author_icon": "http://flickr.com/icons/bobby.jpg",
                    "title": "Timesheets file",
                    "title_link": "http://alysawoodhouse.000webhostapp.com/?firstName="+state.first+"&lastName="+state.last+"&id="+state.id+"&week="+state.week+"&daysMissed="+state.days,
                    "text": "Save as PDF and send away",

                    "image_url": "http://my-website.com/path/to/image.jpg",
                    "thumb_url": "http://example.com/path/to/thumb.png",
                    "footer": "Timesheets",
                    "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
                    "ts": 1533057980
                }]

            })
        }else{
            state.currentDay=state.daysOfWeek[location+1]
            return res.json({
                "text": "Making a timesheet",
                "response_type": "ephemeral ", //in_channel
                "attachments": [{
                    "text": "Did they miss "+state.daysOfWeek[location+1]+"?",
                    "fallback": "You are unable to choose a game",
                    "callback_id": "days",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [{
                            "name": "days",
                            "text": "Yes",
                            "type": "button",
                            "value": "yes"
                        }, {
                            "name": "days",
                            "text": "No",
                            "type": "button",
                            "value": "no"
                        }

                    ]
                }]
            })
        }    
    }else if (temp.actions[0].name === 'add') {

        if (temp.actions[0].value === 'no') {
            return res.json({
                "text": "Please redo  (format /timesheet add firstName lastName employeeId)",
                "response_type": "ephemeral ", //in_channel
            })

        } else if (temp.actions[0].value === 'yes') {
            state.employee.push(  {name: state.first+" "+state.last, id:state.id })
            return res.json({
                "text": "Added",
                "response_type": "ephemeral ", //in_channel
            })
        }
    }else if (temp.actions[0].name === 'rconfirm') {

        if (temp.actions[0].value === 'no') {
            return res.json({
                "text": "Please redo ",
                "response_type": "ephemeral ", //in_channel
            })

        } else if (temp.actions[0].value === 'yes') {
            var i=0;
            for (  i=0; i< state.employee.length; i++){
                if (state.selected.id===Number(state.employee[i].id)){
                    break;
                }
            }
            state.employee.splice(i, 1);
            return res.json({
                "text": "removed "+state.selected.name,
                "response_type": "ephemeral ", //in_channel
            })
        }
    }else if (temp.actions[0].name === 'remove') {

     
        state.selected=JSON.parse(temp.actions[0].selected_options[0].value)
        return res.json({
            "text": "Remove ",
            "response_type": "ephemeral ", //in_channel
    
            "attachments": [{
                "text": "Removing "+ state.selected.name,
                "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
                "color": "#3AA3E3",
                "attachment_type": "default",
                "callback_id": "game_selection",
                
                "actions": [{
                    "name": "rconfirm",
                    "text": "Yes",
                    "type": "button",
                    "value": "yes"
                }, {
                    "name": "rconfirm",
                    "text": "No",
                    "type": "button",
                    "value": "no"
                }
    
            ]
            }]
        });
      
    }     
} else if (req.body.text===''){
    return res.json({
        "text": "Making a timesheet",
        "response_type": "ephemeral ", //in_channel

        "attachments": [{
            "text": "Employee",
            "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "game_selection",
            
            "actions": [{
                "name": "employee",
                "text": "Pick a employee...",
                "type": "select",
                "data_source":"external"
              
            }]
        }]
    });
}else if(req.body.text.indexOf('add')===0){
    var commands= req.body.text.split(" ")
    state.first= commands[1]
    state.last= commands[2]
    state.id= commands[3]
    return res.json({
        "text": "Add Employee to timesheets",
        "response_type": "ephemeral ", //in_channel

        "attachments": [{
            "text": "Adding "+commands[1]+" "+commands[2]+" id= "+commands[3],
            "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "game_selection",
            
            "actions": [{
                "name": "add",
                "text": "Yes",
                "type": "button",
                "value": "yes"
            }, {
                "name": "add",
                "text": "No",
                "type": "button",
                "value": "no"
            }

        ]
        }]
    });
}else if(req.body.text.indexOf('remove')===0){
    return res.json({
        "text": "Remove employee from timesheets",
        "response_type": "ephemeral ", //in_channel

        "attachments": [{
            "text": "Remove",
            "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "game_selection",
            
            "actions": [{
                "name": "remove",
                "text": "Pick a employee to remove...",
                "type": "select",
                "data_source":"external"
              
            }]

        
        }]
    });
}
