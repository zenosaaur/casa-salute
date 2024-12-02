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

def test_create_serviziosala(client, token):
    with patch('app.models.serviziosala.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/serviziosala', data=json.dumps({
                'id_infermiere': values["id_infermiere"],
                'data': '2024-07-11T08:30:00.000Z',
                'sala': values["id_tiposala"]
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Servizio sala creato con successo'

def test_update_serviziosala(client, token):
    with patch('app.models.serviziosala.query.filter_by') as mock_query:
        # Mock the first call to get the existing serviziosala by id
        mock_serviziosala = mock_query.return_value.first.return_value
        mock_serviziosala.id_serviziosala = values["id_serviziosala"]
        mock_serviziosala.id_infermiere = values["id_infermiere"]
        mock_serviziosala.data = '2024-11-15T10:30:00.000Z'
        mock_serviziosala.sala = values["id_tiposala"]

        # Mock the query for existing serviziosala with the new id_infermiere, data, and sala
        mock_query.return_value.first.return_value = None

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/serviziosala/' + values["id_serviziosala"], data=json.dumps({
                'id_infermiere': values["id_infermiere2"],
                'data': '2024-11-15T10:30:00.000Z',
                'sala': values["id_tiposala"]
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Servizio sala aggiornato con successo'
