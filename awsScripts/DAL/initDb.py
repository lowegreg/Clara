import pymysql
db = pymysql.connect(host="db-l5jpoe4odyyvypgiwexyddrqfu.clhelwr0pylt.ca-central-1.rds.amazonaws.com", port=3306, user="Clara", passwd="T1meMachine", db='ClaraTest', autocommit=True)
# prepare a cursor object using cursor() method
cursor = db.cursor() 



tableLookUpCreate= "CREATE TABLE tableLookUp(tableId INT, name VARCHAR(150), description VARCHAR(400), PRIMARY KEY (tableId));" 
propValues= "CREATE TABLE propValues(propId VARCHAR(150), displayName VARCHAR(150), description VARCHAR(400),PRIMARY KEY(propId) );" 
propID= "CREATE TABLE props(propId VARCHAR(150), tableID INT, PRIMARY KEY(propId, tableId), FOREIGN KEY (tableId) REFERENCES tableLookUp(tableId), FOREIGN KEY (propId) REFERENCES propValues(propId));" 

cursor.execute(tableLookUpCreate)
cursor.execute(propValues)
cursor.execute(propID)

