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

def test_create_tipovisita(client, token):
    with patch('app.models.tipovisita.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/tipovisita', data=json.dumps({
                'tipo': 'Testing'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Tipo di visita creato con successo'

def test_update_tipovisita(client, token):
    with patch('app.models.tipovisita.query.filter_by') as mock_query:
        mock_tiposala = mock_query.return_value.first.return_value
        mock_tiposala.id_tipovisita = values["id_tipovisita"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/tipovisita/' + values["id_tipovisita"], data=json.dumps({
                'tipo': 'testing'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Tipo di visita aggiornato con successo'
