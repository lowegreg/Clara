#!/usr/bin/python3
import pymysql
import json
from pprint import pprint
import datetime
import dateutil.parser


# checks if the data feild is in a date format
def checkDate(value):
    try:
        dateutil.parser.parse( value)
        return True
    except ValueError:
        return False
    except OverflowError:
        return False    
#gets max length of the varchar (text) field
def getMaxLength(data, setKey):
    max=0
    for key, value in data.items():
        if key== setKey and value!= None:
            length= len(value)
            if length> max:
                max= length
    return max     
# find the data set where the most properties are not null breaks at 75% then 60%, then 50% not null default is the first row
def grabBestSet(data):
    rvalue=0
    mark60=-1
    mark50=-1
     
    for i in  data:
        nonNull=0
        length= len(i)
        for key, value in i.items():
            if value!= None:
                nonNull=nonNull+1
             
        if (nonNull/length) >= 0.75:
            break 
        elif (nonNull/length) >= 0.60:
            mark60=rvalue
        elif (nonNull/length) >= 0.50:
            mark50=rvalue  
        rvalue=rvalue+1     

    if rvalue==len(data) and mark60!=-1:
        return mark60
    elif  rvalue==len(data) and mark50!=-1:   
        return mark50
    elif rvalue==len(data):
        return 0            
    return rvalue

#checks if the row already exist in the table 
def checkObjectId(objectId, title,cursor):
    query= "SELECT OBJECTID FROM `%s` WHERE OBJECTID = %s" % (title, objectId)
    cursor.execute(query)
    results = cursor.fetchone()
    if results!= None:# does exist already
        return False
    else: # does not exist and marks the able as updated that day
        today=datetime.datetime.today().strftime("%Y-%m-%d")
        query = "UPDATE `tableLookUp` SET `lastUpDated`= \'%s\' where  name=  '%s' " % (today,title)
        cursor.execute(query)
        return True    


def createInsert(data, header, title,cursor):
    ## only add what is not already in the database
    objectId=-1
    for i in data:    
        query= "INSERT INTO  `%s` (" % title
        col = ''
        val = ''
        for key, value in i.items():
            
            col = col + '`'+key + '` ,'
            quoteLess= str(value).replace('\'','`')
            backslashLess= quoteLess.replace('\\','/')
            val = val +'\''+ backslashLess +'\''+ ' ,'
            if key=='OBJECTID' :
                objectId=value
                

        query= query + col[:-1]+ ') VALUES (' + val[:-1]+ ');'    
        if checkObjectId(objectId, title,cursor):
            print(query)
            cursor.execute(query)
#create table for new data set entering clara db
#maps to approtite data set for the db to record correctly
def createTable(header, data, title,cursor):
    startOfquery= "CREATE TABLE IF NOT EXISTS  `%s`  (" % title
    i=0
    setVal=grabBestSet(data)
    for key, value in data[setVal].items(): 
        if isinstance(value, int) or isinstance(value, float)  or  isinstance(value, complex): # checks for a  integer type
            dataTypes = 'int'
        elif   checkDate(str(value)): # checks for date a type
            dataTypes ='date'
        else:  # text type is the only other option, now finds the length of the text, the default is 100 other wise takes the max length in current data set and adds 10
            dataTypes='varchar(100)'    
            if value != None:
                max = getMaxLength(data[0], key)+10 
                dataTypes= 'varchar(%d)' % max 

        subQuery="`"+ header[i]['proptertyID']+ '` '+ dataTypes+','
        startOfquery= startOfquery+ subQuery
        i=i+1 
  

    query= startOfquery + ' PRIMARY KEY (OBJECTID) );'
    print(query)
    cursor.execute(query)


def updatePropertyTables(headerArray, tableId,cursor):    
    for i in range(0, len(headerArray)) : 
        header=  headerArray[i]
        query= "Select * FROM props WHERE propId = '%s' AND tableId = %s " % (header['proptertyID'] , tableId)
        cursor.execute(query)
        propsDNE=cursor.fetchone()
        query= "Select * FROM propValues WHERE propId = '%s'" % header['proptertyID']

        cursor.execute(query)
        propValueDNE=cursor.fetchone()
        if propValueDNE== None:# prop does not exist in the propValue table
            #insert propid dispplay name , descrition) into propvalue
            descript= header['descript'].replace('\'',' \`')
            query = "INSERT INTO propValues (propId, displayName,description) values ('%s' , '%s', '%s')" % ( header['proptertyID'],  header['displayName'], descript)
            cursor.execute(query)
        if propsDNE== None: # prop does not exist in the prop table
            query = " INSERT INTO props (propId, tableId) VALUES ('%s', '%d')" % (header['proptertyID'],tableId )   #insert propid , dbid into props

            cursor.execute(query)





def updateDB(njson):
    # Open database connection
    db = pymysql.connect(host="db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com", port=3306, user="Clara", passwd="T1meMachine", db='Clara', autocommit=True)
    # prepare a cursor object using cursor() method
    cursor = db.cursor() 

 

    title =njson['title']

    query= "SELECT tableId FROM tableLookUp WHERE  name=  '%s'" % title
    cursor.execute(query)
    queryValue= cursor.fetchone()
    tableId=0
    tableDNE=0
    #check if the table already exist, if it does then it will be in the tablelookup if its not we add it
    if queryValue == None:
        descript= njson['description'].replace('\'',' \`')
        query= "INSERT INTO tableLookUp (name, description) VALUES ('%s', '%s')" %(njson['title'], descript)
        cursor.execute(query)
        tableId=cursor.lastrowid
        tableDNE=1
        updatePropertyTables(njson['header'], tableId,cursor )# # insert header information
    else:    
        tableId =queryValue[0] 

    #create the new table if it does not exist
    print (tableDNE)
    if tableDNE == 1:
        createTable(njson['header'],njson['data'],njson['title'],cursor)
    print ('entering data...')
    # insert new data information
    createInsert(njson['data'], njson['header'], title,cursor)

    # disconnect from server
    db.close()




