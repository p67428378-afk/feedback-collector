from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Text as SQLAText

db = SQLAlchemy()

class Form(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(SQLAText, nullable=True)
    # Define SQLAText as the base type, and then specify JSONB for 'postgresql'
    fields = db.Column(SQLAText().with_variant(JSONB(), 'postgresql'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    submissions = db.relationship('Submission', backref='form', lazy=True)

    def __repr__(
        self):
        return f"<Form {self.title}>"

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'fields': self.fields, # This will be a JSON string or dict depending on DB
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('form.id'), nullable=False)
    # Define SQLAText as the base type, and then specify JSONB for 'postgresql'
    data = db.Column(SQLAText().with_variant(JSONB(), 'postgresql'), nullable=False)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Submission {self.id} for Form {self.form_id}>"

    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'data': self.data,
            'submitted_at': self.submitted_at.isoformat()
        }
