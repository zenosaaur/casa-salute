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

def test_create_medico(client, token):
    with patch('app.models.medico.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/medico', data=json.dumps({
                'specializzazione': 'Psichiatra',
                'codicesanitario': '552',
                'nome': 'John',
                'cognome': 'Doe',
                'email': 'gggggg@example.com',
                'password': 'password',
                'codicefiscale': 'XYZ123',
                'data': '2000-01-01',
                'luogonascita': 'City'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Medico e utente creati con successo'

def test_create_medicoFromUtente(client, token):
    with patch('app.models.medico.query.filter_by') as mock_query:
        mock_query.return_value.first.return_value = None
        with patch.object(db.session, 'add') as mock_add, \
             patch.object(db.session, 'commit') as mock_commit:

            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.post('/medico/'+values['id_utente_notExist'], data=json.dumps({
                'specializzazione': 'Psichiatra',
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()

            assert json_data['message'] == 'Medico creato con successo'

def test_update_medico(client, token):
    with patch('app.models.medico.query.filter_by') as mock_query:
        mock_user = mock_query.return_value.first.return_value
        mock_user.id_medico = values["id_medico"]

        with patch.object(db.session, 'commit') as mock_commit:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            response = client.put('/medico/' + values["id_medico"], data=json.dumps({
                'specializzazione': 'Boh'
            }), headers=headers)

            assert response.status_code == 200
            json_data = response.get_json()
            assert json_data['message'] == 'Medico aggiornato con successo'
