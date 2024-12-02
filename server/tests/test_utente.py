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

def test_create_utente(client, token):
    with patch('app.models.utente.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/utente', data=json.dumps({
                'nome': 'John',
                'cognome': 'Doe',
                'email': 'john.doe@example.com',
                'password': 'password',
                'codicefiscale': 'XYZ123',
                'data': '2000-01-01',
                'luogonascita': 'City'
            }), headers=headers)

            
            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Utente creato con successo'

def test_update_utente(client, token):
    with patch('app.models.utente.query.filter_by') as mock_query:
        mock_user = mock_query.return_value.first.return_value
        mock_user.id_utente = values["id_utente"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/utente/' + values["id_utente"], data=json.dumps({
                'nome': 'John',
                'cognome': 'Doe',
                'email': 'john.doe@example.com',
                'password': 'password',
                'codicefiscale': 'XYZ123',
                'data': '2000-01-01',
                'luogonascita': 'City'
            }), headers=headers)

            print(response.get_json())

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Utente aggiornato con successo'
