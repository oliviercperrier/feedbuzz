from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()


class User(Base):
    __tablename__ = "user"
    # Here we define columns for the table person
    # Notice that each column is also a normal Python instance attribute.
    id = Column(Integer, primary_key=True)
    username = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    password = Column(String(250), nullable=False)

    def to_dict(self):
        return {"user_id": self.id, "username": self.username, "email": self.email}


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False, unique=True)
    type_id = Column(Integer, ForeignKey("product_type.id"))
    type = relationship("ProductType", backref="product")

    thc_min = Column(Float)
    thc_max = Column(Float)
    cbd_min = Column(Float)
    cbd_max = Column(Float)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "type_id": self.type_id}


class ProductType(Base):
    __tablename__ = "product_type"
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False, unique=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name}



class ProductPrice(Base):
    __tablename__ = "product_price"
    product = relationship("Product", backref="product_price")
    product_id = Column(Integer, ForeignKey("product.id"))
    id = Column(Integer, primary_key=True)
    price = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)

class RefreshToken(Base): 
    __tablename__ = "refresh_token"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    token = Column(String(500), nullable=False)


DATABASE_URL = os.environ['DATABASE_URL']
engine = create_engine(DATABASE_URL)

#engine = create_engine("postgresql://postgres:feedbuzz@localhost:5430/feedbuzz")

# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
res = Base.metadata.create_all(engine)
print(res)
