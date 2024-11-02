from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv
import uuid
from typing import Optional

# Load environment variables
load_dotenv()

# Initialize app and Neo4j driver
app = FastAPI()

NEO_URI = os.getenv("NEO_URI")
NEO_USER = os.getenv("NEO_USER")
NEO_PASS = os.getenv("NEO_PASS")
driver = GraphDatabase.driver(NEO_URI, auth=(NEO_USER, NEO_PASS))

# Database utility functions
def get_neo4j_session():
    with driver.session() as session:
        yield session

# Models
class User(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    school_year: int
    num_of_connections: int
    invited_by: uuid.UUID | None = None

# helper functions
def find_by_uuid(session, user_id: uuid.UUID):
    query = """
    MATCH (u:User {id: $user_id})
    RETURN u
    """
    result = session.run(query, user_id=str(user_id))
    user_data = result.single()
    
    if user_data:
        # Extract properties from the node
        user = user_data["u"]
        return {
            "id": user["id"],
            "name": user["name"],
            "phone_number": user["phone_number"],
            "school_year": user["school_year"],
            "num_of_connections": user["num_of_connections"],
            "invited_by": user.get("invited_by")
        }
    else:
        return None
    
def find_by_name(session, name: str):
    query = """
    MATCH (u:User {name: $name})
    RETURN u
    """
    result = session.run(query, name=name)
    user_data = result.single()
    
    if user_data:
        # Extract properties from the node
        user = user_data["u"]
        return {
            "id": user["id"],
            "name": user["name"],
            "phone_number": user["phone_number"],
            "school_year": user["school_year"],
            "num_of_connections": user["num_of_connections"],
            "invited_by": user.get("invited_by")
        }
    else:
        return None

# Endpoints

# ----------------- USER MANAGEMENT ------------------
@app.post("/users")
async def create_user(user: User, session=Depends(get_neo4j_session)):
    query = """
    CREATE (u:User {
        id: $id,
        name: $name,
        phone_number: $phone_number,
        school_year: $school_year,
        num_of_connections: $num_of_connections,
        invited_by: $invited_by
    })
    RETURN u
    """
    # Run the query
    result = session.run(query, 
                         id=str(user.id), 
                         name=user.name, 
                         phone_number=user.phone_number, 
                         school_year=user.school_year, 
                         num_of_connections=user.num_of_connections, 
                         invited_by=str(user.invited_by) if user.invited_by else None)
    
    # Get the created user node from the result
    created_user = result.single()
    
    if created_user:
        return {"message": "User created successfully", "user": created_user["u"]}
    else:
        raise HTTPException(status_code=500, detail="Failed to create user")

class ConnectionRequest(BaseModel):
    user1: uuid.UUID
    user2: uuid.UUID

from uuid import UUID  # Import UUID directly from uuid

def increment_connections(user_id: UUID, session=Depends(get_neo4j_session)):
    # Query to increment the num_of_connections field for the given user
    query = """
    MATCH (u:User {id: $user_id})
    SET u.num_of_connections = coalesce(u.num_of_connections, 0) + 1
    RETURN u.num_of_connections AS num_of_connections
    """
    
    # Run the query and pass the user_id as a parameter
    result = session.run(query, user_id=str(user_id))
    updated_data = result.single()
    
    if updated_data:
        return {"message": "User's connection count updated successfully", "num_of_connections": updated_data["num_of_connections"]}
    else:
        return {"message": "User not found or could not update connections"}

async def create_connection_by_uuid(user1: UUID, user2: UUID, session=Depends(get_neo4j_session)):
    # Check if both users exist in the database
    user1_exists = session.run("MATCH (u:User {id: $user1_id}) RETURN u", user1_id=str(user1)).single()
    user2_exists = session.run("MATCH (u:User {id: $user2_id}) RETURN u", user2_id=str(user2)).single()
    
    if not user1_exists or not user2_exists:
        raise HTTPException(status_code=404, detail="One or both users not found")

    # Create the connection if both users exist
    session.run("""
        MATCH (u1:User {id: $user1_id}), (u2:User {id: $user2_id})
        MERGE (u1)-[:CONNECTED_TO]->(u2)
        MERGE (u2)-[:CONNECTED_TO]->(u1)
    """, user1_id=str(user1), user2_id=str(user2))

    increment_connections(user1, session=session)

    return {"message": "Connection created successfully"}

class ConnectionByNameRequest(BaseModel):
    name1: str
    name2: str

# New Endpoint for Creating a Connection by Name
@app.post("/connect_users_by_name")
async def connect_users_by_name(connection_request: ConnectionByNameRequest, session=Depends(get_neo4j_session)):
    # Find users by their names
    user1_data = find_by_name(session, connection_request.name1)
    user2_data = find_by_name(session, connection_request.name2)

    # Check if both users exist
    if not user1_data or not user2_data:
        raise HTTPException(status_code=404, detail="One or both users not found")

    # Create the connection if both users exist
    session.run("""
        MATCH (u1:User {id: $user1_id}), (u2:User {id: $user2_id})
        MERGE (u1)-[:CONNECTED_TO]->(u2)
        MERGE (u2)-[:CONNECTED_TO]->(u1)
    """, user1_id=str(user1_data["id"]), user2_id=str(user2_data["id"]))
    
    increment_connections(user1_data["id"], session=session)

    return {"message": "Connection created successfully between users"}

@app.post("/connect_users")
async def connect_users(connection_request: ConnectionRequest, session=Depends(get_neo4j_session)):
    return await create_connection_by_uuid(connection_request.user1, connection_request.user2, session)  

@app.get("/users/{user_id}")
async def get_user(user_id: uuid.UUID, session=Depends(get_neo4j_session)):
    user = find_by_uuid(session, user_id)
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")

async def create_user_and_connect(user: User, existing_user_id: UUID, session=Depends(get_neo4j_session)):
    # Create a new user node with the details from the user model
    create_user_query = """
    CREATE (new_user:User {
        id: $id,
        name: $name,
        email: $email,
        school_year: $school_year,
        num_of_connections: $num_of_connections,
        invited_by: $invited_by
    })
    RETURN new_user
    """
    
    # Run the query to create the new user node
    result = session.run(
        create_user_query,
        id=str(user.id),
        name=user.name,
        email=user.email,
        school_year=user.school_year,
        num_of_connections=user.num_of_connections,
        invited_by=str(user.invited_by) if user.invited_by else None
    )
    
    # Check if the new user was created
    new_user_data = result.single()
    if not new_user_data:
        raise HTTPException(status_code=500, detail="Failed to create the new user")

    # Create a connection between the existing user and the new user
    connect_query = """
    MATCH (existing_user:User {id: $existing_user_id}), (new_user:User {id: $new_user_id})
    MERGE (existing_user)-[:CONNECTED_TO]->(new_user)
    MERGE (new_user)-[:CONNECTED_TO]->(existing_user)
    """
    
    # Run the query to create the connection
    session.run(
        connect_query,
        existing_user_id=str(existing_user_id),
        new_user_id=str(user.id)
    )
    
    # Increment the connection count for the existing user
    increment_connections(existing_user_id, session=session)

    return {"message": "New user created and connected successfully"}
# ------------------ FEED -------------------------

