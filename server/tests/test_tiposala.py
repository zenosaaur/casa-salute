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

def test_create_tiposala(client, token):
    with patch('app.models.tiposala.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/tiposala', data=json.dumps({
                'tipo': 'Testing'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Tipo di sala creato con successo'

def test_update_tiposala(client, token):
    with patch('app.models.tiposala.query.filter_by') as mock_query:
        mock_tiposala = mock_query.return_value.first.return_value
        mock_tiposala.id_tiposala = values["id_tiposala"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/tiposala/' + values["id_tiposala"], data=json.dumps({
                'tipo': 'testing'
            }), headers=headers)

            print(response.get_json())

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Tipo di sala aggiornato con successo'
