from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, ARRAY
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
    name = Column(String(250), nullable=False)
    gender = Column(String(250))
    image_url = Column(String(250))

    def to_dict(self):
        return {
        "user_id": self.id,
        "username": self.username,
        "email": self.email,
        "name": self.name,
        "gender": self.gender,
        "image_url": self.image_url
        }


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

    # def to_dict(self):
    #     return {
    #         "id": self.id,
    #         "name": self.name,
    #         "type_id": self.type_id,
    #         "url": self.url,
    #         "image_url": self.image_url,
    #         "thc_min": self.thc_min,
    #         "thc_max": self.thc_max,
    #         "cbd_min": self.cbd_min,
    #         "cbd_max": self.cbd_max,
    #         "avg": dao.CommentDAO.get_average_rating_by_product(self.id)
    #     }


class ProductType(Base):
    __tablename__ = "product_type"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False, unique=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
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
    identifier = Column(String(250), nullable=False)


class RatingStep(Base):
    __tablename__ = "rating_step"
    id = Column(Integer, primary_key=True, autoincrement=True)
    step_type = Column(String(100))
    common = Column(ARRAY(String(50)))
    added = Column(ARRAY(String(50)))
    rating = Column(Integer)
    rating_id = Column(Integer, ForeignKey("rating.id"))
    rating_rel = relationship("Rating")

    def to_dict(self):
        return {"id": self.id, "step_type": self.step_type, "common": self.common, "added": self.added, "rating": self.rating}


class Rating(Base):
    __tablename__ = "rating"
    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("product.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    comment = Column(String(2500), nullable=False)
    rating = Column(Integer, nullable=False, default=0)
    rating_step = relationship("RatingStep", lazy="joined", backref="ratings")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "user_id": self.user_id,
            "rating": self.rating,
            "rating_step": [step.to_dict() for step in self.rating_step],
            "comment": self.comment
        }

# engine = create_engine("postgresql://postgres:feedbuzz@localhost:5430/feedbuzz")

# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
def serve_configs_model(configs):
    print("Serve configs model")
    engine = create_engine(configs.DATABASE_URL)
    res = Base.metadata.create_all(engine)
    print(res)
