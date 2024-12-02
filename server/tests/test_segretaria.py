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

def test_create_segretaria(client, token):
    with patch('app.models.segretaria.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/segretaria', data=json.dumps({
                'nome': 'John',
                'cognome': 'Doe',
                'email': 'EEEEEEZZ.doe@example.com',
                'password': 'password',
                'codicefiscale': 'XYZ123',
                'data': '2000-01-01',
                'luogonascita': 'City'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Segretaria e utente creati con successo'

def test_create_segretariafromutente(client, token):
    with patch('app.models.segretaria.query.filter_by') as mock_query:
        mock_tiposala = mock_query.return_value.first.return_value
        mock_tiposala.id_segretaria = values["id_segretaria"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/segretaria/' + values["id_utente_notExist"], data=json.dumps({}), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Segretaria creato con successo'
