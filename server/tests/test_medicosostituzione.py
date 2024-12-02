import json
from unittest.mock import patch
from flask_jwt_extended import create_access_token
import pytest
from conftest import values 
from app.extensions import db

@pytest.fixture
def token(client):
    user_identity = 'ste@gmail.com'  
    return create_access_token(identity=user_identity)

def test_create_medicosostituzione(client, token):
    with patch('app.models.medicosostituzione.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/medicosostituto', data=json.dumps({
                'id_medico': values['id_medico3'],
                'id_medicosostituto': values['id_medicosostituto3']
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Medico sostituto creato con successo'

def test_update_medicosostituzione(client, token):
    with patch('app.models.medicosostituzione.query.filter_by') as mock_query:
        mock_user = mock_query.return_value.first.return_value
        mock_user.id_medicosostituzione = values["id_medicosostituzione"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/medicosostituto/' + values["id_medicosostituzione"], data=json.dumps({
                'id_medico': values['id_medico2'],
                'id_medicosostituto': values['id_medicosostituto2']
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Medico sostituto aggiornato con successo'
