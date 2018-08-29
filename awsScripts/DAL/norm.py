#!/usr/bin/python3
# Purpose: to create normilized and update clara db from geojson objects that are returned from open kitchener api's 
# format
#      [ Title; "name of data set we are pulling"
#     header: {
#         propertyID: "property name that is returned form open data kitchener api"
#         displayName : "renaming the propery to make more sense for the data"
#         description; "explaing more about what this prorperty means"
#          },
#     Data: {   
#     }
#     ]
import json
import urllib.request
import csv
import datetime
import db
#opens a file that holds all open kitchener api routes 
# returns a sdouble array of the csv file 
def getAPIRoutes(fileName):
    with open(fileName, 'r') as f:
        datastore = json.load(f)
        return datastore


#purpose:open csv that hold all open data kitchener's propertie names and new names and descriptions for all apis
# retruns an array of proptery name values
def openCSV():
    with open('GeoJSONpropName.csv') as csvfile:
        readCSV = csv.reader(csvfile, delimiter=',')
        propsArray= list(readCSV)# [name,route,propName,newPropName,description]
        return propsArray

# purpose: create a header for njson object to better describe properties
# execution:
# loops all properties in the orginal json from open kitchener api
    # create a json object with property name, display name and descripton
    # the display name and desctiptions are grabed from geoJsonpropName.csv where we have made the best fit names
# returns a json object of the new header
def setHeader(propsArray, apiRoute):
    headerArray = []
    for i in range (0, len(propsArray)):
        if propsArray[i][1] == apiRoute:
            headerValue= {}
            dpName=propsArray[i][3]
            if (dpName==''):
                dpName=propsArray[i][2]
            headerValue['proptertyID']=propsArray[i][2]
            headerValue['displayName']= dpName
            headerValue['descript']=propsArray[i][4]
            headerArray.append(headerValue)

    return headerArray

# purpose: to reconstruct old json with new property names
# execution: 
#converts values returned form api to a json object
#gabs the key values of the json to get the current property names that open kitchener api returns
#loops all data sets in the json
    # createing a new json object with the new titles 
# returns : the newly constructed json object witht he new property names    
def setData(nJsonHeaders, oJsonString):
    dataArray= []
    oJson = json.loads(oJsonString)
    currentPropNames =list( oJson['features'][0]['properties'].keys())
    for i in range(0, len(oJson['features'])):
        prop = {}
        for j in range(0, len(nJsonHeaders)):
            indexVal = currentPropNames.index(nJsonHeaders[j]['proptertyID'])
            if indexVal>=0:
                headerName= currentPropNames[indexVal]
                dpName= nJsonHeaders[j]['displayName']
                prop[dpName] =  oJson['features'][i]['properties'][headerName]
        dataArray.append(prop)
    return dataArray

# create new Json object then send it to clara's db
def setnJson( propsArray, apiRoute, oJson, title, description, update):
    nJson={}
    nJson['title']=title
    nJson['description']=description
    nJson['update']= update
    nJson['header']=setHeader(propsArray, apiRoute)
    nJson['data']=setData(nJson['header'], oJson)

    db.updateDB(nJson)
    print ('done')



def getDayofWeek():
    return  (datetime.datetime.today().weekday()) # week start on monday =0 

# main function
# exeutes every day weekly apis are called on sundays
# loops all open kitchener apis stored in openData.json
    #get api title 
    #call the api
    #gets the new proptery names
    #set new json object and send to db
def normGeoJson():
    day = getDayofWeek()
    allnjson =[]
    count =0;  
    routes = getAPIRoutes("openData.json") 
    for i in range(0, len(routes)):
        # try: 
        route=routes[i]
        if day == 6 or (day!= 6 and route['Update'] =='daily'): 
            print ( route['Title'], route['API'], i)
            oJson = urllib.request.urlopen(route['API']).read()
            propsArray = openCSV()  
            setnJson( propsArray, route['API'], oJson, route['Title'], route['Description'], route['Update'])
        # except:
        # print (i, 'failed')    

normGeoJson()    
