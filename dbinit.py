import pymongo
from pymongo import MongoClient

client = MongoClient('localhost',27017)
db = client.projects

users = db.create_collection('users')
projects = db.create_collection('projects')
usecases = db.create_collection('usecases')

admin = {"name":"admin","role":"administrator","projects":[]}

x = users.insert_one(admin)