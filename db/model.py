from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
import os

Base = declarative_base()


class User(Base):
    __tablename__ = "user"
    # Here we define columns for the table person
    # Notice that each column is also a normal Python instance attribute.
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    password = Column(String(250), nullable=False)

    def to_dict(self):
        return {"user_id": self.id, "username": self.username, "email": self.email}


class ProductType(Base):
    __tablename__ = "product_type"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False, unique=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False, unique=True)
    type_id = Column(Integer, ForeignKey("product_type.id"))
    type = relationship("ProductType", lazy="joined", backref="products")
    url = Column(String(256), nullable=False, unique=False)
    image_url = Column(String(256), nullable=False, unique=False)
    thc_min = Column(Float)
    thc_max = Column(Float)
    cbd_min = Column(Float)
    cbd_max = Column(Float)
    prices = relationship("ProductPrice", lazy="joined", back_populates="product", order_by=lambda: ProductPrice.price)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            # "type_id": self.type_id,
            "url": self.url,
            "image_url": self.image_url,
            "thc_min": self.thc_min,
            "thc_max": self.thc_max,
            "cbd_min": self.cbd_min,
            "cbd_max": self.cbd_max,
            "type": self.type.to_dict(),
            "price": [price.to_dict() for price in self.prices],
        }


class ProductPrice(Base):
    __tablename__ = "product_price"
    id = Column(Integer, primary_key=True, autoincrement=True)
    product = relationship("Product")
    product_id = Column(Integer, ForeignKey("product.id"))
    price = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    grams = Column(Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "price": self.price,
            # "date": self.date.strftime("%Y-%m-%d %H:%M:%S"),
            "grams": self.grams,
        }


class RefreshToken(Base):
    __tablename__ = "refresh_token"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    token = Column(String(500), nullable=False)


# engine = create_engine("postgresql://postgres:feedbuzz@localhost:5430/feedbuzz")

# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
def serve_configs_model(configs):
    print("Serve configs model")
    engine = create_engine(configs.DATABASE_URL)
    res = Base.metadata.create_all(engine)
    print(res)
