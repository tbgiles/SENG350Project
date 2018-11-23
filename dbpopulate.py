import pymongo
from pymongo import MongoClient

client = MongoClient('localhost',27017)
db = client.projects

# collections
users = db.users
projects = db.projects
usecases = db.usecases

# -------------------- users --------------------

# users json
admin = {"name":"Admin", "role":"administrator", "projects":[]}
tristan = {"name":"Tristan", "role":"user", "projects":[]}
matt = {"name":"Matt", "role":"user", "projects":[]}
amrit = {"name":"Amrit", "role":"user", "projects":[]}
geena = {"name":"Geena", "role":"user", "projects":[]}
jens = {"name":"Dr Jens Weber - UML Master", "role":"user", "projects":[]}

user_ids = users.insert_many([admin,tristan, matt, amrit, geena, jens])


# -------------------- projects --------------------

# project json
p1 = {"title":"project 1", "useCases":[]}
p2 = {"title":"project 2", "useCases":[]}
p3 = {"title":"project 3", "useCases":[]}

p1i = projects.insert_one(p1)
p2i = projects.insert_one(p2)
p3i = projects.insert_one(p3)

#tristan=owner, Matt=read, Amrit=write
users.update_one({"name":"Tristan"},{ '$push': {"projects": {'_id':p1i.inserted_id,"permission":"owner"}} })
users.update_one({"name":"Matt"},{ '$push': {"projects": {'_id':p1i.inserted_id,"permission":"read"}} })
users.update_one({"name":"Amrit"},{ '$push': {"projects": {'_id':p1i.inserted_id,"permission":"write"}} })

#matt=owner, tristan=read, amrit=read
users.update_one({"name":"Matt"},{ '$push': {"projects": {'_id':p2i.inserted_id,"permission":"owner"}} })
users.update_one({"name":"Tristan"},{ '$push': {"projects": {'_id':p2i.inserted_id,"permission":"read"}} })
users.update_one({"name":"Amrit"},{ '$push': {"projects": {'_id':p2i.inserted_id,"permission":"read"}} })

#geena=owner, tristan=write, amrit=write
users.update_one({"name":"Geena"},{ '$push': {"projects": {'_id':p3i.inserted_id,"permission":"owner"}} })
users.update_one({"name":"Tristan"},{ '$push': {"projects": {'_id':p3i.inserted_id,"permission":"write"}} })
users.update_one({"name":"Amrit"},{ '$push': {"projects": {'_id':p3i.inserted_id,"permission":"read"}} })


# -------------------- use cases --------------------

# use case json
u1a = {"title":"use case 1a", "goal":"goal 1", "scope":"scope 1", "level":"level 1", \
"preconditions":"condition 1, condition 2", "successEndCondition":"success 1", \
"failedEndCondition":"fail 1", "primaryActor":"a1", "secondaryActors":"actor1, actor2", \
"trigger":"trigger1", "description":"step1, step2", \
"extensions":"step1, step2", "subVariations":"step1, step2"}

u1b = {"title":"use case 1b", "goal":"goal 1", "scope":"scope 1", "level":"level 1", \
"preconditions":"condition 1, condition 2", "successEndCondition":"success 1", \
"failedEndCondition":"fail 1", "primaryActor":"a1", "secondaryActors":"actor1, actor2", \
"trigger":"trigger1", "description":"step1, step2", \
"extensions":"step1, step2", "subVariations":"step1, step2"}

u2a = {"title":"use case 1", "goal":"goal 1", "scope":"scope 1", "level":"level 1", \
"preconditions":"condition 1, condition 2", "successEndCondition":"success 1", \
"failedEndCondition":"fail 1", "primaryActor":"a1", "secondaryActors":"actor1, actor2", \
"trigger":"trigger1", "description":"step1, step2", \
"extensions":"step1, step2", "subVariations":"step1, step2"}

u3a = {"title":"use case 1", "goal":"goal 1", "scope":"scope 1", "level":"level 1", \
"preconditions":"condition 1, condition 2", "successEndCondition":"success 1", \
"failedEndCondition":"fail 1", "primaryActor":"a1", "secondaryActors":"actor1, actor2", \
"trigger":"trigger1", "description":"step1, step2", \
"extensions":"step1, step2", "subVariations":"step1, step2"}

u1ai = usecases.insert_one(u1a)
u1bi = usecases.insert_one(u1b)
u2ai = usecases.insert_one(u2a)
u3ai = usecases.insert_one(u3a)

# project 1 has 2 use cases, projects 2 and 3 each have 1
projects.update_one({"title":"project 1"},{ '$push': {"useCases": {'_id':u1ai.inserted_id}} })
projects.update_one({"title":"project 1"},{ '$push': {"useCases": {'_id':u1bi.inserted_id}} })
projects.update_one({"title":"project 2"},{ '$push': {"useCases": {'_id':u2ai.inserted_id}} })
projects.update_one({"title":"project 3"},{ '$push': {"useCases": {'_id':u3ai.inserted_id}} })