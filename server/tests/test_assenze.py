import json
from unittest.mock import patch
from flask_jwt_extended import create_access_token
import pytest
from conftest import values 
from app.repositories.assenze_repository import AssenzaRepository
from app.extensions import db

@pytest.fixture
def token(client):
    user_identity = 'ste@gmail.com'  
    return create_access_token(identity=user_identity)

def test_create_assenza(client, token):
    with patch('app.models.assenza.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/assenza', data=json.dumps({
                'id_medico': values["id_medico"],
                'data': '2024-10-11T08:30:00.000Z'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Assenza creata con successo'

def test_update_assenza(client, token):
    with patch('app.models.assenza.query.filter_by') as mock_query:
        mock_assenza = mock_query.return_value.first.return_value
        mock_assenza.id_assenza = values["id_assenza"]
        mock_assenza.id_medico = values["id_medico"]
        mock_assenza.data = '2024-06-12T00:00:00.000Z'

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/assenza/' + values["id_assenza"], data=json.dumps({
                'id_medico': values["id_medico"],
                'data': '2024-06-12T00:00:00.000Z'
            }), headers=headers)

            print(response.get_json())

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Assenza aggiornata con successo'
