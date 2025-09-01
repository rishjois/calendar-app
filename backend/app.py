from flask import Flask, jsonify
from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base

# TODO: replace placeholders with actual database credentials
DATABASE_URL = "mysql+pymysql://root:test_root@localhost:3306/calendar"

engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(512), nullable=False)
    password = Column(String(512), nullable=False)
    first_name = Column(String(512))
    last_name = Column(String(512))
    tasks = relationship("Task", back_populates="user")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(512))
    deadline = Column(Date)
    parent_id = Column(Integer, ForeignKey("tasks.id"))
    completed = Column(Boolean, default=False)
    deleted = Column(Boolean, default=False)

    user = relationship("User", back_populates="tasks")
    parent_tasks = relationship("Task", backref="parent", remote_side=[id])

def task_to_dict(task):
    return {
        "id": task.id,
        "title": task.title,
        "deadline": task.deadline.isoformat() if task.deadline else None,
        "completed": task.completed,
        "subtasks": []
    }

def build_task_tree(session, user_id):
    tasks = session.query(Task).filter_by(user_id=user_id, deleted=False).all()
    task_map = {t.id: task_to_dict(t) for t in tasks}
    roots = []
    for task in tasks:
        item = task_map[task.id]
        if task.parent_id and task.parent_id in task_map:
            task_map[task.parent_id]["subtasks"].append(item)
        else:
            roots.append(item)
    return roots

app = Flask(__name__)

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user_and_tasks(user_id):
    session = SessionLocal()
    user = session.get(User, user_id)
    if not user:
        session.close()
        return jsonify({"error": "User not found"}), 404
    tasks = build_task_tree(session, user_id)
    session.close()
    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name
        },
        "tasks": tasks
    })

if __name__ == "__main__":
    app.run(debug=True)
