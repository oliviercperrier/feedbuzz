from sqlalchemy import Column, Integer, String, Float, DateTime 
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()


class User(Base):
    __tablename__ = "user"
    # Here we define columns for the table person
    # Notice that each column is also a normal Python instance attribute.
    id = Column(Integer, primary_key=True)
    first_name = Column(String(250), nullable=False)
    last_name = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    password = Column(String(250), nullable=False)

    def to_dict(self):
        return {
            "user_id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
        }


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    # vendor = Column(String(250), nullable=False)
    # country
    # province
    # type = Column(Integer, ForeignKey("product_type.id"))
    type = relationship("ProductType")
    # price = Column(Integer, ForeignKey("product_price.id"))

    thc_min = Column(Integer)
    thc_max = Column(Integer)
    cbd_min = Column(Integer)
    cbd_max = Column(Integer)


class ProductType(Base):
    __tablename__ = "product_type"
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)


class ProductPrice(Base):
    __tablename__ = "product_price"
    product = relationship("Product")
    id = Column(Integer, primary_key=True)
    price = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)


engine = create_engine("postgresql://postgres:feedbuzz@localhost:5430/feedbuzz")

# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
res = Base.metadata.create_all(engine)
print(res)
