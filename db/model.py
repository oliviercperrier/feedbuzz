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


class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False, unique=True)
    type_id = Column(Integer, ForeignKey("product_type.id"))
    # type = relationship("ProductType", backref="product")
    url = Column(String(256), nullable=False, unique=False)
    image_url = Column(String(256), nullable=False, unique=False)
    thc_min = Column(Float)
    thc_max = Column(Float)
    cbd_min = Column(Float)
    cbd_max = Column(Float)
    prices = relationship("ProductPrice", back_populates="product")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type_id": self.type_id,
            "url": self.url,
            "image_url": self.image_url,
            "thc_min": self.thc_min,
            "thc_max": self.thc_max,
            "cbd_min": self.cbd_min,
            "cbd_max": self.cbd_max,
        }


class ProductType(Base):
    __tablename__ = "product_type"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False, unique=True)

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class ProductPrice(Base):
    __tablename__ = "product_price"
    id = Column(Integer, primary_key=True, autoincrement=True)
    product = relationship("Product", backref="product_price")
    product_id = Column(Integer, ForeignKey("product.id"))
    price = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False)
    grams = Column(Float, nullable=False)


class RefreshToken(Base):
    __tablename__ = "refresh_token"
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    token = Column(String(500), nullable=False)


class CommentRatingStep(Base):
    __tablename__ = "comments_rating_step"
    id = Column(Integer, primary_key=True, autoincrement=True)
    type = Column(String(100))
    common = Column(ARRAY(String(50)))
    added = Column(ARRAY(String(50)))
    rating = Column(Integer)
    comment_id = Column(Integer, ForeignKey("comments.id"), backref="comments")

    def to_dict(self):
        return {
                "id": self.id,
                "type": self.type,
                "common": self.common,
                "added": self.added,
                "rating": self.rating,
                }


class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, autoincrement=True)
    author_id = Column(Integer, ForeignKey("user.id"))
    parent_comment_id = Column(Integer, ForeignKey("comment.id"))
    content = Column(String(2500), nullable=False)
    score = Column(Integer, nullable=False, default=0)
    replies = relationship("Comment")
    comment_rating_step = relationship("CommentRatingStep")

    def to_dict(self):
        return {
            "id": self.id,
            "author_id": self.author_id,
            "content": self.content,
            "score": self.score,
            "replies": [reply.to_dict() for reply in self.replies],
        }


# engine = create_engine("postgresql://postgres:feedbuzz@localhost:5430/feedbuzz")

# Create all tables in the engine. This is equivalent to "Create Table"
# statements in raw SQL.
def serve_configs_model(configs):
    print("Serve configs model")
    engine = create_engine(configs.DATABASE_URL)
    res = Base.metadata.create_all(engine)
    print(res)
