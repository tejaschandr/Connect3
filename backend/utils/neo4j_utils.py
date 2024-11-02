from neo4j import GraphDatabase
import os
from dotenv import load_dotenv

load_dotenv()
# ENV variables
NEO_URI = os.getenv("NEO_URI")
NEO_USER = os.getenv("NEO_USER")
NEO_PASS= os.getenv("NEO_PASS")
NEO_AUTH = (NEO_USER, NEO_PASS)

def main(): 
    NEO_URI = os.getenv("NEO_URI")
    NEO_USER = os.getenv("NEO_USER")
    NEO_PASS= os.getenv("NEO_PASS")
    NEO_AUTH = (NEO_USER, NEO_PASS)

    driver = GraphDatabase.driver(NEO_URI, auth=NEO_AUTH)
    try:
        driver.verify_connectivity()
        print("connection established!")
    finally:
        driver.close()

if __name__ == "__main__":
    main()
