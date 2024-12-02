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

def test_create_responsabile(client, token):
    with patch('app.models.responsabile.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/responsabile', data=json.dumps({
                'id_paziente': values["id_paziente"],
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

            assert json_data['message'] == 'Responsabile e utente creati con successo'

def test_create_responsabilefromutente(client, token):
    with patch('app.models.responsabile.query.filter_by') as mock_query:
        mock_tiposala = mock_query.return_value.first.return_value
        mock_tiposala.id_utente = values["id_utente"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/responsabile/' + values["id_utente"], data=json.dumps({
                'id_paziente': values['id_paziente']
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Responsabile creato con successo'

def test_update_responsabile(client, token):
    with patch('app.models.responsabile.query.filter_by') as mock_query:
        mock_tiposala = mock_query.return_value.first.return_value
        mock_tiposala.id_responsabile = values["id_responsabile"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/responsabile/' + values["id_responsabile"], data=json.dumps({
                'id_paziente': values["id_paziente"],
                'id_utente': values["id_utente_notExist"]
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Responsabile modificato con successo'
