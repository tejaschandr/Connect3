from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv
import uuid
from typing import Optional, List
from uuid import UUID

# Load environment variables
load_dotenv()

# Initialize app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Neo4j configuration with error handling
NEO_URI = os.getenv("NEO_URI")
NEO_USER = os.getenv("NEO_USER")
NEO_PASS = os.getenv("NEO_PASS")

if not all([NEO_URI, NEO_USER, NEO_PASS]):
    raise ValueError("Missing required Neo4j environment variables")

try:
    driver = GraphDatabase.driver(NEO_URI, auth=(NEO_USER, NEO_PASS))
    # Test the connection
    with driver.session() as session:
        session.run("RETURN 1")
except Exception as e:
    print(f"Failed to connect to Neo4j: {str(e)}")
    raise

# Models
class User(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    school_year: int
    num_of_connections: int = 0
    invited_by: Optional[uuid.UUID] = None

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "John Doe",
                "email": "john@example.com",
                "school_year": 2,
                "num_of_connections": 0,
                "invited_by": None
            }
        }

class ConnectionRequest(BaseModel):
    user1: uuid.UUID
    user2: uuid.UUID

class ConnectionByNameRequest(BaseModel):
    name1: str
    name2: str

# Database session management
def get_neo4j_session():
    try:
        with driver.session() as session:
            yield session
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

# Helper functions
def find_by_uuid(session, user_id: uuid.UUID):
    try:
        query = """
        MATCH (u:User {id: $user_id})
        RETURN u
        """
        result = session.run(query, user_id=str(user_id))
        user_data = result.single()
        
        if user_data:
            user = user_data["u"]
            return {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "school_year": user["school_year"],
                "num_of_connections": user["num_of_connections"],
                "invited_by": user.get("invited_by")
            }
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def find_by_name(session, name: str):
    try:
        query = """
        MATCH (u:User {name: $name})
        RETURN u
        """
        result = session.run(query, name=name)
        user_data = result.single()
        
        if user_data:
            user = user_data["u"]
            return {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "school_year": user["school_year"],
                "num_of_connections": user["num_of_connections"],
                "invited_by": user.get("invited_by")
            }
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

def increment_connections(user_id: UUID, session) -> dict:
    try:
        query = """
        MATCH (u:User {id: $user_id})
        SET u.num_of_connections = coalesce(u.num_of_connections, 0) + 1
        RETURN u.num_of_connections AS num_of_connections
        """
        
        result = session.run(query, user_id=str(user_id))
        updated_data = result.single()
        
        if updated_data:
            return {
                "message": "User's connection count updated successfully",
                "num_of_connections": updated_data["num_of_connections"]
            }
        return {"message": "User not found or could not update connections"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to increment connections: {str(e)}")

# Endpoints

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# User Management Endpoints
@app.post("/users", response_model=dict)
async def create_user(user: User, session=Depends(get_neo4j_session)):
    try:
        # Check if user with same email already exists
        existing_user = session.run(
            "MATCH (u:User {email: $email}) RETURN u",
            email=user.email
        ).single()
        
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )

        query = """
        CREATE (u:User {
            id: $id,
            name: $name,
            email: $email,
            school_year: $school_year,
            num_of_connections: $num_of_connections,
            invited_by: $invited_by
        })
        RETURN u
        """
        
        result = session.run(
            query,
            id=str(user.id),
            name=user.name,
            email=user.email,
            school_year=user.school_year,
            num_of_connections=user.num_of_connections,
            invited_by=str(user.invited_by) if user.invited_by else None
        )
        
        created_user = result.single()
        
        if not created_user:
            raise HTTPException(status_code=500, detail="Failed to create user")
            
        user_dict = dict(created_user["u"])
        return {"message": "User created successfully", "user": user_dict}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while creating the user: {str(e)}"
        )

@app.get("/users/{user_id}")
async def get_user(user_id: uuid.UUID, session=Depends(get_neo4j_session)):
    user = find_by_uuid(session, user_id)
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")

# Connection Management Endpoints
@app.post("/connect_users")
async def connect_users(connection_request: ConnectionRequest, session=Depends(get_neo4j_session)):
    try:
        user1_exists = session.run(
            "MATCH (u:User {id: $user1_id}) RETURN u",
            user1_id=str(connection_request.user1)
        ).single()
        
        user2_exists = session.run(
            "MATCH (u:User {id: $user2_id}) RETURN u",
            user2_id=str(connection_request.user2)
        ).single()
        
        if not user1_exists or not user2_exists:
            raise HTTPException(status_code=404, detail="One or both users not found")

        # Create bidirectional connection
        session.run("""
            MATCH (u1:User {id: $user1_id}), (u2:User {id: $user2_id})
            MERGE (u1)-[:CONNECTED_TO]->(u2)
            MERGE (u2)-[:CONNECTED_TO]->(u1)
        """, user1_id=str(connection_request.user1), user2_id=str(connection_request.user2))

        # Increment connection counts
        increment_connections(connection_request.user1, session)
        increment_connections(connection_request.user2, session)

        return {"message": "Connection created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create connection: {str(e)}"
        )

@app.post("/connect_users_by_name")
async def connect_users_by_name(connection_request: ConnectionByNameRequest, session=Depends(get_neo4j_session)):
    try:
        user1_data = find_by_name(session, connection_request.name1)
        user2_data = find_by_name(session, connection_request.name2)

        if not user1_data or not user2_data:
            raise HTTPException(status_code=404, detail="One or both users not found")

        # Create bidirectional connection
        session.run("""
            MATCH (u1:User {id: $user1_id}), (u2:User {id: $user2_id})
            MERGE (u1)-[:CONNECTED_TO]->(u2)
            MERGE (u2)-[:CONNECTED_TO]->(u1)
        """, user1_id=str(user1_data["id"]), user2_id=str(user2_data["id"]))

        # Increment connection counts
        increment_connections(UUID(user1_data["id"]), session)
        increment_connections(UUID(user2_data["id"]), session)

        return {"message": "Connection created successfully between users"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create connection: {str(e)}"
        )

@app.post("/create_user_and_connect")
async def create_user_and_connect(user: User, existing_user_id: UUID, session=Depends(get_neo4j_session)):
    try:
        # First create the new user
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
        
        result = session.run(
            create_user_query,
            id=str(user.id),
            name=user.name,
            email=user.email,
            school_year=user.school_year,
            num_of_connections=user.num_of_connections,
            invited_by=str(user.invited_by) if user.invited_by else None
        )
        
        new_user_data = result.single()
        if not new_user_data:
            raise HTTPException(status_code=500, detail="Failed to create the new user")

        # Create connection between existing user and new user
        connect_query = """
        MATCH (existing_user:User {id: $existing_user_id}), (new_user:User {id: $new_user_id})
        MERGE (existing_user)-[:CONNECTED_TO]->(new_user)
        MERGE (new_user)-[:CONNECTED_TO]->(existing_user)
        """
        
        session.run(
            connect_query,
            existing_user_id=str(existing_user_id),
            new_user_id=str(user.id)
        )
        
        # Increment connection counts for both users
        increment_connections(existing_user_id, session)
        increment_connections(user.id, session)

        return {"message": "New user created and connected successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create user and establish connection: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)