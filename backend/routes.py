from flask import Blueprint, request, jsonify
from backend.models import db, Form, Submission
from sqlalchemy.exc import IntegrityError
import json

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/forms', methods=['POST'])
def create_form():
    try:
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        fields = data.get('fields')

        if not title or not fields:
            return jsonify({'error': 'Title and fields are required'}), 400

        # Ensure fields is a valid JSON structure
        if not isinstance(fields, list):
            return jsonify({'error': 'Fields must be a list'}), 400

        new_form = Form(
            title=title,
            description=description,
            fields=json.dumps(fields) # Store fields as JSON string
        )
        db.session.add(new_form)
        db.session.commit()
        return jsonify(new_form.to_dict()), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Form with this title already exists'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/forms', methods=['GET'])
def get_forms():
    forms = Form.query.all()
    return jsonify([form.to_dict() for form in forms]), 200

@api_bp.route('/forms/<int:form_id>', methods=['GET'])
def get_form(form_id):
    form = Form.query.get_or_404(form_id)
    return jsonify(form.to_dict()), 200

@api_bp.route('/forms/<int:form_id>', methods=['PUT'])
def update_form(form_id):
    form = Form.query.get_or_404(form_id)
    data = request.get_json()

    form.title = data.get('title', form.title)
    form.description = data.get('description', form.description)
    
    fields = data.get('fields')
    if fields:
        if not isinstance(fields, list):
            return jsonify({'error': 'Fields must be a list'}), 400
        form.fields = json.dumps(fields)

    db.session.commit()
    return jsonify(form.to_dict()), 200

@api_bp.route('/forms/<int:form_id>', methods=['DELETE'])
def delete_form(form_id):
    form = Form.query.get_or_404(form_id)
    db.session.delete(form)
    db.session.commit()
    return jsonify({'message': 'Form deleted'}), 204

@api_bp.route('/forms/<int:form_id>/submit', methods=['POST'])
def submit_feedback(form_id):
    form = Form.query.get_or_404(form_id)
    submission_data = request.get_json()

    if not submission_data:
        return jsonify({'error': 'Submission data is required'}), 400

    # Ensure strict anonymity: DO NOT store any PII or metadata
    # The 'data' field should only contain the form responses.
    new_submission = Submission(
        form_id=form.id,
        data=json.dumps(submission_data) # Store submission data as JSON string
    )
    db.session.add(new_submission)
    db.session.commit()
    return jsonify({'message': 'Feedback submitted successfully'}), 201

@api_bp.route('/forms/<int:form_id>/submissions', methods=['GET'])
def get_submissions(form_id):
    form = Form.query.get_or_404(form_id)
    submissions = Submission.query.filter_by(form_id=form.id).all()
    return jsonify([submission.to_dict() for submission in submissions]), 200
