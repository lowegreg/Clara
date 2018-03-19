#!/usr/bin/python3
import pymysql
import json
from pprint import pprint
import datetime
import dateutil.parser

db = pymysql.connect(host="aa3c9aa9sse4d7.clhelwr0pylt.ca-central-1.rds.amazonaws.com", port=3306, user="Clara", passwd="T1meMachine", db='ClaraTest', autocommit=True)
# prepare a cursor object using cursor() method
cursor = db.cursor() 


title= 'Building Permits'
today=datetime.datetime.today().strftime("%Y-%m-%d")
print (today)
query = "UPDATE `tableLookUp` SET `lastUpDated`= \'%s\' where  name=  '%s' " % (today,title)
print (query)
cursor.execute(query)