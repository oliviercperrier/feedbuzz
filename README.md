# feedbuzz
LOG515 TPs

## Setup
- Create a venv: `python3 -m venv venv`
- Activate the venv: `source venv/bin/activate`
- Install requirements: `pip install -r requirements.txt`
- Install package for root directory, run `npm install`.
- Install package for client directory, `cd client` and run `npm install`

- Start the app: in the root directory run `npm start`. It should start the DB, the frontend and the backend.

- Create the database shema `python db/model.py`
- Populate the database `python db/insert_data.py`

*See what's in the container:*
- List all container `docker ps -a`
- `docker exec -it <container_id> /bin/sh`
- `psql feedbuzz feedbuzz`
- Now run sql command or psql command ex `\dt` to see the tables

# CALL

## SQDC API
- Product info: `curl 'https://www.sqdc.ca/api/product/specifications' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Language: en-CA' -H 'Content-Type: application/json' -H 'X-Requested-With: XMLHttpRequest' -H 'DNT: 1' -H 'Connection: keep-alive' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' --data '{"productId":"628582000074-P"}'`


# FEEDBUZ API/ROUTES

## -POST /auth
  ### - Body:
    ```
    {
      "email": "<email>",
      "password": "<password>"
    }
    ```
  ### - Return
    ```
      {
        "acces_token": "<token>"
      }
    ```
## -GET /auth/me
  ### - Return
    ```
     {
        "me": {
          "user_id": <id>,
          "first_name": "<first_name>"
          "last_name": "<last_name>"
          "email": "<email>"
        }
     }
    ```

## Bubdubuuu.ca
- https://www.budbudbud.ca/api/v1/strains?page=1&per_page=50&column=name&direction=asc&with_trashed=0&quantity=&type=&count=all&strain_hide=[]&show_hidden=0&ignore_stores=[]&province=qc&_=1548200672682

# Feedbuzz Rating data model
```
{
    "0": {
        "value": 1
    },
    "1": {
        "value": 72
    },
    "2": {
        "commonEffects": ["Headache", "Euphoric", "Dry mouth"],
        "addedEffects": ["Pain", "Horrible"]
    },
    "3": {
        "commonFlavors": ["Grape", "Flowery", "Lemon"],
        "addedFlavors": ["Shit", "Grass"]
    },
    "4": {
        "rating": 4,
        "comment": "Test comment blablabla blablabla blablabla blablabla"
    }
}
```

## Where:
  - 0: High Step
  - 1: Red eye Step
  - 2: Effects Step
  - 3: Flavors Step
  - 4: Final comment Step
